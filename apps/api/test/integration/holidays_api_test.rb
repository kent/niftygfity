require "test_helper"

class HolidaysApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = create_test_user
    post user_session_path, params: { user: { email: @user.email, password: "password123" } }, as: :json
    @token = response.headers["Authorization"]
  end

  test "index returns holidays" do
    holiday = Holiday.create!(name: "Christmas", date: Date.new(2025, 12, 25))
    HolidayUser.create!(user: @user, holiday: holiday)

    get holidays_path, headers: { "Authorization" => @token }, as: :json

    assert_response :success
    assert json_response.is_a?(Array)
  end

  test "show returns a holiday" do
    holiday = Holiday.create!(name: "Christmas", date: Date.new(2025, 12, 25))
    HolidayUser.create!(user: @user, holiday: holiday)

    get holiday_path(holiday), headers: { "Authorization" => @token }, as: :json

    assert_response :success
    assert_equal "Christmas", json_response["name"]
  end

  test "create creates a holiday" do
    post holidays_path, params: {
      holiday: { name: "New Years", date: "2026-01-01" }
    }, headers: { "Authorization" => @token }, as: :json

    assert_response :created
    assert_equal "New Years", json_response["name"]
  end

  test "update modifies a holiday" do
    holiday = Holiday.create!(name: "Christmas", date: Date.new(2025, 12, 25))
    HolidayUser.create!(user: @user, holiday: holiday)

    patch holiday_path(holiday), params: {
      holiday: { name: "Christmas Day" }
    }, headers: { "Authorization" => @token }, as: :json

    assert_response :success
    assert_equal "Christmas Day", json_response["name"]
  end

  test "destroy removes a holiday" do
    holiday = Holiday.create!(name: "Christmas", date: Date.new(2025, 12, 25))
    HolidayUser.create!(user: @user, holiday: holiday)

    assert_difference("Holiday.count", -1) do
      delete holiday_path(holiday), headers: { "Authorization" => @token }, as: :json
    end

    assert_response :no_content
  end
end
