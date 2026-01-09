require "test_helper"

class EmailPreferencesApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    # Ensure user has an email preferences token
    @user.update!(email_preferences_token: SecureRandom.urlsafe_base64(32)) unless @user.email_preferences_token.present?
    @token = @user.email_preferences_token
    # Ensure notification prefs exist
    @user.notification_preference || @user.create_notification_preference!
  end

  # ============================================================================
  # Show Tests (Token-based, no auth)
  # ============================================================================

  test "show returns email preferences by token" do
    get "/email_preferences/#{@token}", as: :json
    assert_response :success
    assert json_response.key?("preferences") || json_response.key?("user")
  end

  test "show returns 404 for invalid token" do
    get "/email_preferences/invalid_token_here", as: :json
    assert_response :not_found
  end

  # ============================================================================
  # Update Tests (Token-based, no auth)
  # ============================================================================

  test "update modifies email preferences by token" do
    patch "/email_preferences/#{@token}",
      params: { pending_gifts_reminder_enabled: false },
      as: :json
    assert_response :success
  end

  test "update with invalid token returns 404" do
    patch "/email_preferences/invalid_token_here",
      params: { pending_gifts_reminder_enabled: false },
      as: :json
    assert_response :not_found
  end
end
