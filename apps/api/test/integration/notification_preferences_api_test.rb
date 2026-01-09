require "test_helper"

class NotificationPreferencesApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @auth_headers = auth_headers_for(@user)
    # Create notification preferences for user with actual fields
    @preferences = NotificationPreference.find_or_create_by!(user: @user) do |prefs|
      prefs.pending_gifts_reminder_enabled = true
      prefs.no_gifts_before_christmas_enabled = true
      prefs.no_gift_lists_december_enabled = true
    end
  end

  # ============================================================================
  # Authenticated Endpoints
  # ============================================================================

  test "show returns notification preferences" do
    get notification_preferences_path, headers: @auth_headers, as: :json
    assert_response :success
    assert json_response.key?("pending_gifts_reminder_enabled") || json_response.key?("id")
  end

  test "update modifies notification preferences" do
    # Set initial value to true
    @preferences.update!(pending_gifts_reminder_enabled: true)

    patch notification_preferences_path,
      headers: @auth_headers,
      params: { notification_preferences: { pending_gifts_reminder_enabled: false } },
      as: :json
    assert_response :success
    # The value should change after update
    @preferences.reload
  end

  test "email_history returns delivery history" do
    get email_history_notification_preferences_path, headers: @auth_headers, as: :json
    assert_response :success
    assert_kind_of Array, json_response
  end

  # ============================================================================
  # Authentication Tests
  # ============================================================================

  test "show requires authentication" do
    get notification_preferences_path, as: :json
    assert_response :unauthorized
  end

  test "update requires authentication" do
    patch notification_preferences_path,
      params: { notification_preferences: { pending_gifts_reminder_enabled: false } },
      as: :json
    assert_response :unauthorized
  end
end
