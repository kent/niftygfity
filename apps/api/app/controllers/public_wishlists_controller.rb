class PublicWishlistsController < ApplicationController
  skip_before_action :authenticate_clerk_user!

  class ClaimError < StandardError; end

  before_action :set_wishlist
  before_action :set_item, only: [ :claim ]

  # GET /w/:token
  def show
    render json: WishlistBlueprint.render(@wishlist, view: :public)
  end

  # POST /w/:token/items/:item_id/claim
  def claim
    guest_name = claim_params[:claimer_name]
    guest_email = claim_params[:claimer_email]&.strip&.downcase
    quantity = (claim_params[:quantity] || 1).to_i
    purchased = claim_params[:purchased] == true || claim_params[:purchased] == "true"

    # Validate guest identity
    if guest_name.blank? || guest_email.blank?
      return render json: { error: "Name and email are required" }, status: :unprocessable_entity
    end

    # Check if this email already claimed this item
    existing_claim = @item.claims.by_guest_email(guest_email).first
    if existing_claim
      return render json: { error: "This email has already claimed this item" }, status: :unprocessable_entity
    end

    # Use pessimistic locking to prevent race conditions
    new_claim = @item.with_lock do
      if @item.fully_claimed?
        raise ClaimError, "Item is fully claimed"
      end

      available = @item.available_quantity
      if quantity > available
        raise ClaimError, "Only #{available} available"
      end

      @item.claims.create!(
        claimer_name: guest_name,
        claimer_email: guest_email,
        quantity: quantity,
        status: purchased ? "purchased" : "reserved",
        purchased_at: purchased ? Time.current : nil
      )
    end

    # Send confirmation email with magic link
    GuestClaimMailer.claim_confirmation(new_claim).deliver_later

    render json: {
      message: "Item claimed! Check your email for a link to manage your claim.",
      claim_id: new_claim.id
    }, status: :created
  rescue ClaimError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def set_wishlist
    @wishlist = Wishlist.includes(wishlist_items: :claims)
                        .find_by!(share_token: params[:token], visibility: "shared")
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Wishlist not found or not shared" }, status: :not_found
  end

  def set_item
    @item = @wishlist.wishlist_items.active.find(params[:item_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Item not found" }, status: :not_found
  end

  def claim_params
    params.require(:claim).permit(:claimer_name, :claimer_email, :quantity, :purchased)
  end
end
