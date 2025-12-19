class ExchangeParticipantsController < ApplicationController
  before_action :set_gift_exchange
  before_action :require_owner, only: %i[create update destroy resend_invite]
  before_action :set_participant, only: %i[show update destroy resend_invite]

  def index
    participants = @gift_exchange.exchange_participants.includes(:user, :wishlist_items)
    view = @gift_exchange.owner?(current_user) ? :admin : :default
    render json: ExchangeParticipantBlueprint.render(participants, view: view)
  end

  def show
    view = @gift_exchange.owner?(current_user) ? :admin : :default
    render json: ExchangeParticipantBlueprint.render(@participant, view: view)
  end

  def create
    participant = @gift_exchange.exchange_participants.new(participant_params)

    if participant.save
      # Send invitation email
      ExchangeMailer.invitation(participant).deliver_later

      # Update exchange status if still draft
      @gift_exchange.update!(status: "inviting") if @gift_exchange.status == "draft"

      render json: ExchangeParticipantBlueprint.render(participant, view: :admin), status: :created
    else
      render json: { errors: participant.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @participant.update(participant_params)
      render json: ExchangeParticipantBlueprint.render(@participant, view: :admin)
    else
      render json: { errors: @participant.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @participant.destroy!
    head :no_content
  end

  def resend_invite
    return render_error("Participant has already accepted") if @participant.status == "accepted"

    ExchangeMailer.invitation(@participant).deliver_later
    render json: { message: "Invitation resent" }
  end

  private

  def set_gift_exchange
    @gift_exchange = GiftExchange.for_user(current_user).find(params[:gift_exchange_id])
  end

  def set_participant
    @participant = @gift_exchange.exchange_participants.find(params[:id])
  end

  def require_owner
    return if @gift_exchange.owner?(current_user)
    render json: { error: "Only the owner can perform this action" }, status: :forbidden
  end

  def participant_params
    params.require(:exchange_participant).permit(:name, :email)
  end
end
