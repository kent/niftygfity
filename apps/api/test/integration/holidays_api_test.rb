require "test_helper"

class HolidaysApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @auth_headers = auth_headers_for(@user)
  end

  test "index returns holidays" do
    get holidays_path, headers: @auth_headers, as: :json
    assert_response :success
    assert_not_nil json_response
  end

  test "show returns a holiday" do
    holiday = holidays(:christmas)
    get holiday_path(holiday), headers: @auth_headers, as: :json
    assert_response :success
    assert_equal holiday.name, json_response["name"]
  end

  test "create creates a holiday" do
    assert_difference("Holiday.count") do
      post holidays_path,
        headers: @auth_headers,
        params: { holiday: { name: "New Holiday", date: "2025-01-01" } },
        as: :json
    end
    assert_response :created
  end

  test "update modifies a holiday" do
    holiday = holidays(:christmas)
    patch holiday_path(holiday),
      headers: @auth_headers,
      params: { holiday: { name: "Updated Holiday" } },
      as: :json
    assert_response :success
    assert_equal "Updated Holiday", holiday.reload.name
  end

  test "destroy removes a holiday" do
    holiday = holidays(:christmas)
    assert_difference("Holiday.count", -1) do
      delete holiday_path(holiday), headers: @auth_headers, as: :json
    end
    assert_response :success
  end
end
