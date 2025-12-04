require "test_helper"

class AuthenticationTest < ActionDispatch::IntegrationTest
  test "protected routes require authentication" do
    get holidays_path, as: :json
    assert_response :unauthorized
  end

  test "protected routes accessible with valid token" do
    user = create_test_user

    headers = auth_headers_for(user)
    get holidays_path, headers: headers, as: :json

    assert_response :success
  end

  test "user is auto-created if not exists" do
    # Simulate a valid Clerk token for a user not in our DB
    clerk_id = "user_new_456"
    email = "new@example.com"

    mock_clerk_token("some_valid_token", { "sub" => clerk_id, "email" => email })

    assert_difference("User.count", 1) do
      get holidays_path, headers: { "Authorization" => "Bearer some_valid_token" }, as: :json
    end

    assert_response :success
    new_user = User.find_by(clerk_user_id: clerk_id)
    assert_not_nil new_user
    assert_equal email, new_user.email
  end
end
