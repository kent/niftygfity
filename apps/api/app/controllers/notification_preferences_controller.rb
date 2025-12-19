class NotificationPreferencesController < ApplicationController
  # GET /notification_preferences
  def show
    render json: NotificationPreferenceBlueprint.render_as_hash(current_user.notification_prefs)
  end

  # PATCH /notification_preferences
  def update
    prefs = current_user.notification_prefs
    if prefs.update(notification_preference_params)
      render json: NotificationPreferenceBlueprint.render_as_hash(prefs)
    else
      render_error(prefs.errors.full_messages.join(", "))
    end
  end

  # GET /notification_preferences/email_history
  def email_history
    deliveries = current_user.email_deliveries.recent.limit(20)
    render json: EmailDeliveryBlueprint.render_as_hash(deliveries)
  end

  private

  def notification_preference_params
    params.permit(
      :pending_gifts_reminder_enabled,
      :no_gifts_before_christmas_enabled,
      :no_gift_lists_december_enabled
    )
  end
end
