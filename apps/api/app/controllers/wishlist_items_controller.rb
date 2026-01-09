class WishlistItemsController < ApplicationController
  include WorkspaceScoped

  class ClaimError < StandardError; end

  before_action :set_wishlist
  before_action :set_item, only: %i[show update destroy claim unclaim mark_purchased]
  before_action :require_owner, only: %i[create update destroy reorder]

  def index
    items = @wishlist.wishlist_items.active.by_priority.includes(:claims)
    render json: WishlistItemBlueprint.render(items, current_user: current_user)
  end

  def show
    render json: WishlistItemBlueprint.render(@item, current_user: current_user)
  end

  def create
    item = @wishlist.wishlist_items.build(item_params)

    if item.save
      render json: WishlistItemBlueprint.render(item, current_user: current_user), status: :created
    else
      render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @item.update(item_params)
      render json: WishlistItemBlueprint.render(@item, current_user: current_user)
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @item.destroy!
    head :no_content
  end

  # PATCH /wishlists/:wishlist_id/wishlist_items/reorder
  def reorder
    positions = params[:positions] # { item_id: position }

    WishlistItem.transaction do
      positions.each do |item_id, position|
        @wishlist.wishlist_items.find(item_id).update!(position: position)
      end
    end

    items = @wishlist.wishlist_items.active.by_position
    render json: WishlistItemBlueprint.render(items, current_user: current_user)
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: "Item not found: #{e.message}" }, status: :not_found
  end

  # POST /wishlists/:wishlist_id/wishlist_items/:id/claim
  def claim
    # Owners cannot claim their own items
    if @wishlist.owner?(current_user)
      return render json: { error: "You cannot claim items from your own wishlist" }, status: :forbidden
    end

    # Check if user already claimed this item
    existing_claim = @item.claims.by_user(current_user).first
    if existing_claim
      return render json: { error: "You have already claimed this item" }, status: :unprocessable_entity
    end

    quantity = (params[:quantity] || 1).to_i
    purchased = params[:purchased] == true || params[:purchased] == "true"

    # Use pessimistic locking to prevent race conditions
    claim = @item.with_lock do
      if @item.fully_claimed?
        raise ClaimError, "Item is fully claimed"
      end

      available = @item.available_quantity
      if quantity > available
        raise ClaimError, "Only #{available} available"
      end

      @item.claims.create!(
        user: current_user,
        quantity: quantity,
        status: purchased ? "purchased" : "reserved",
        purchased_at: purchased ? Time.current : nil
      )
    end

    render json: WishlistItemClaimBlueprint.render(claim), status: :created
  rescue ClaimError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  # DELETE /wishlists/:wishlist_id/wishlist_items/:id/unclaim
  def unclaim
    claim = @item.claims.by_user(current_user).first

    unless claim
      return render json: { error: "You have not claimed this item" }, status: :not_found
    end

    claim.destroy!
    head :no_content
  end

  # PATCH /wishlists/:wishlist_id/wishlist_items/:id/mark_purchased
  def mark_purchased
    claim = @item.claims.by_user(current_user).first

    unless claim
      return render json: { error: "You have not claimed this item" }, status: :not_found
    end

    claim.mark_purchased!
    render json: WishlistItemClaimBlueprint.render(claim)
  end

  private

  def set_wishlist
    @wishlist = Wishlist.visible_to(current_user, current_workspace)
                        .includes(:user)
                        .find(params[:wishlist_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Wishlist not found" }, status: :not_found
  end

  def set_item
    @item = @wishlist.wishlist_items.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Item not found" }, status: :not_found
  end

  def require_owner
    return if @wishlist.owner?(current_user)
    render json: { error: "Only the wishlist owner can perform this action" }, status: :forbidden
  end

  def item_params
    params.require(:wishlist_item).permit(:name, :notes, :url, :price_min, :price_max, :priority, :quantity, :image_url)
  end
end
