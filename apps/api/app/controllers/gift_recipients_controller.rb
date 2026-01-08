# frozen_string_literal: true

class GiftRecipientsController < ApplicationController
  before_action :set_gift
  before_action :set_gift_recipient

  def update
    if @gift_recipient.update(gift_recipient_params)
      render json: GiftBlueprint.render(@gift, current_user: current_user)
    else
      render json: { errors: @gift_recipient.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_gift
    @gift = Gift.joins(:holiday).where(holidays: { id: current_user.holiday_ids }).find(params[:gift_id])
  end

  def set_gift_recipient
    @gift_recipient = @gift.gift_recipients.find(params[:id])
  end

  def gift_recipient_params
    params.require(:gift_recipient).permit(:shipping_address_id)
  end
end
