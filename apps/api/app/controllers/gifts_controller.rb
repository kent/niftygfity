class GiftsController < ApplicationController
  before_action :set_gift, only: %i[show update destroy reorder]
  before_action :check_gift_limit, only: [ :create ]

  def index
    gifts = Gift.joins(:holiday).where(holidays: { id: current_user.holiday_ids })
    render json: GiftBlueprint.render(gifts)
  end

  def show
    render json: GiftBlueprint.render(@gift)
  end

  def create
    gift = Gift.new(gift_params)

    if gift.save
      auto_share_people(gift)
      render json: GiftBlueprint.render(gift), status: :created
    else
      render json: { errors: gift.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @gift.update(gift_params)
      auto_share_people(@gift)
      render json: GiftBlueprint.render(@gift)
    else
      render json: { errors: @gift.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @gift.destroy!
    head :no_content
  end

  def reorder
    new_position = params[:position].to_i
    Gift.reorder_within_holiday(@gift.holiday_id, @gift.id, new_position)

    # Return all gifts for this holiday with updated positions
    gifts = Gift.where(holiday_id: @gift.holiday_id)
    render json: GiftBlueprint.render(gifts)
  end

  private

  def set_gift
    @gift = Gift.joins(:holiday).where(holidays: { id: current_user.holiday_ids }).find(params[:id])
  end

  def gift_params
    params.require(:gift).permit(:name, :description, :link, :cost, :holiday_id, :gift_status_id, :position, recipient_ids: [], giver_ids: [])
  end

  def check_gift_limit
    return if current_user.can_create_gift?

    render json: {
      error: "Gift limit reached",
      message: "You've used all #{User::FREE_GIFT_LIMIT} free gifts. Upgrade to Premium for unlimited gift tracking.",
      gifts_remaining: 0,
      upgrade_required: true
    }, status: :payment_required
  end

  # Auto-share people to the holiday when they're assigned as recipients or givers
  def auto_share_people(gift)
    holiday = gift.holiday
    person_ids = (gift.recipient_ids + gift.giver_ids).uniq

    person_ids.each do |person_id|
      HolidayPerson.find_or_create_by(holiday_id: holiday.id, person_id: person_id)
    end
  end
end
