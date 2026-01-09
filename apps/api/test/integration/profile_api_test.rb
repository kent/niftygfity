require "test_helper"

class ProfileApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @auth_headers = auth_headers_for(@user)
  end

  # ============================================================================
  # Sync Tests
  # ============================================================================

  test "sync updates user profile" do
    post "/profile/sync",
      headers: @auth_headers,
      params: { first_name: "Updated", last_name: "Name" },
      as: :json
    assert_response :success
    @user.reload
    assert_equal "Updated", @user.first_name
    assert_equal "Name", @user.last_name
  end

  test "sync works without params" do
    post "/profile/sync", headers: @auth_headers, as: :json
    assert_response :success
  end

  test "sync can update image_url" do
    post "/profile/sync",
      headers: @auth_headers,
      params: { image_url: "https://example.com/avatar.jpg" },
      as: :json
    assert_response :success
    assert_equal "https://example.com/avatar.jpg", @user.reload.image_url
  end

  # ============================================================================
  # Authentication Tests
  # ============================================================================

  test "requires authentication" do
    post "/profile/sync", as: :json
    assert_response :unauthorized
  end
end
