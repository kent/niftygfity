# Token-based email preferences (no authentication required)
# Used for one-click unsubscribe links in emails
class EmailPreferencesController < ActionController::API
  before_action :find_user_by_token

  # GET /email_preferences/:token
  def show
    render json: {
      user: { email: @user.email, name: @user.safe_name },
      preferences: NotificationPreferenceBlueprint.render_as_hash(@user.notification_prefs)
    }
  end

  # PATCH /email_preferences/:token
  def update
    prefs = @user.notification_prefs
    if prefs.update(notification_preference_params)
      render json: {
        user: { email: @user.email, name: @user.safe_name },
        preferences: NotificationPreferenceBlueprint.render_as_hash(prefs)
      }
    else
      render json: { error: prefs.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  private

  def find_user_by_token
    @user = User.find_by(email_preferences_token: params[:token])
    render json: { error: "Invalid or expired link" }, status: :not_found unless @user
  end

  def notification_preference_params
    params.permit(
      :pending_gifts_reminder_enabled,
      :no_gifts_before_christmas_enabled,
      :no_gift_lists_december_enabled
    )
  end
end
