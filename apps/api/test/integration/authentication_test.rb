require "test_helper"

class AuthenticationTest < ActionDispatch::IntegrationTest
  test "user can sign up" do
    post user_registration_path, params: {
      user: {
        email: "newuser@example.com",
        password: "password123",
        password_confirmation: "password123"
      }
    }, as: :json

    assert_response :created
    assert_equal "newuser@example.com", json_response["user"]["email"]
    assert_equal "Signed up successfully.", json_response["message"]
    assert_not_nil response.headers["Authorization"]
  end

  test "user cannot sign up with invalid data" do
    post user_registration_path, params: {
      user: {
        email: "invalid",
        password: "short",
        password_confirmation: "mismatch"
      }
    }, as: :json

    assert_response :unprocessable_entity
    assert json_response["errors"].present?
  end

  test "user can sign in with valid credentials" do
    user = create_test_user

    post user_session_path, params: {
      user: { email: user.email, password: "password123" }
    }, as: :json

    assert_response :ok
    assert_equal "Logged in successfully.", json_response["message"]
    assert_equal user.email, json_response["user"]["email"]
    assert_not_nil response.headers["Authorization"]
  end

  test "user cannot sign in with invalid credentials" do
    user = create_test_user

    post user_session_path, params: {
      user: { email: user.email, password: "wrongpassword" }
    }, as: :json

    assert_response :unauthorized
  end

  test "user can sign out" do
    user = create_test_user

    # Sign in first
    post user_session_path, params: { user: { email: user.email, password: "password123" } }, as: :json
    assert_response :ok
    token = response.headers["Authorization"]

    # Sign out
    delete destroy_user_session_path, headers: { "Authorization" => token }

    assert_response :ok
    assert_equal "Logged out successfully.", json_response["message"]
  end

  test "protected routes require authentication" do
    get holidays_path, as: :json

    assert_response :unauthorized
  end

  test "protected routes accessible with valid token" do
    user = create_test_user

    # Sign in
    post user_session_path, params: { user: { email: user.email, password: "password123" } }, as: :json
    assert_response :ok
    token = response.headers["Authorization"]

    # Access protected route
    get holidays_path, headers: { "Authorization" => token }, as: :json

    assert_response :success
  end
end
