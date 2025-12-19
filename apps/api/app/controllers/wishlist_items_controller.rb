class WishlistItemsController < ApplicationController
  before_action :set_participant
  before_action :require_participant_owner, only: %i[create update destroy]
  before_action :set_wishlist_item, only: %i[show update destroy]

  def index
    items = @participant.wishlist_items
    render json: WishlistItemBlueprint.render(items)
  end

  def show
    render json: WishlistItemBlueprint.render(@wishlist_item)
  end

  def create
    item = @participant.wishlist_items.new(wishlist_item_params)

    if item.save
      render json: WishlistItemBlueprint.render(item), status: :created
    else
      render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @wishlist_item.update(wishlist_item_params)
      render json: WishlistItemBlueprint.render(@wishlist_item)
    else
      render json: { errors: @wishlist_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @wishlist_item.destroy!
    head :no_content
  end

  private

  def set_participant
    @participant = ExchangeParticipant.find(params[:exchange_participant_id])
    # Verify current user has access to this participant's exchange
    exchange = @participant.gift_exchange
    unless exchange.owner?(current_user) || @participant.user_id == current_user.id
      render json: { error: "Access denied" }, status: :forbidden
    end
  end

  def set_wishlist_item
    @wishlist_item = @participant.wishlist_items.find(params[:id])
  end

  def require_participant_owner
    return if @participant.user_id == current_user.id
    render json: { error: "You can only manage your own wishlist" }, status: :forbidden
  end

  def wishlist_item_params
    params.require(:wishlist_item).permit(:name, :description, :link, :price, :photo)
  end
end
