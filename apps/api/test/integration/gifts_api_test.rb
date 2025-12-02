require "test_helper"

class GiftsApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = create_test_user
    post user_session_path, params: { user: { email: @user.email, password: "password123" } }, as: :json
    @token = response.headers["Authorization"]
    @status = GiftStatus.find_or_create_by!(name: "Idea") { |s| s.position = 1 }
    @holiday = Holiday.create!(name: "Christmas #{SecureRandom.hex(4)}", date: Date.new(2025, 12, 25))
    HolidayUser.create!(user: @user, holiday: @holiday)
  end

  test "index returns gifts" do
    Gift.create!(name: "Sweater", gift_status: @status, holiday: @holiday)

    get gifts_path, headers: { "Authorization" => @token }, as: :json

    assert_response :success
    assert json_response.is_a?(Array)
  end

  test "show returns a gift" do
    gift = Gift.create!(name: "Sweater", gift_status: @status, holiday: @holiday)

    get gift_path(gift), headers: { "Authorization" => @token }, as: :json

    assert_response :success
    assert_equal "Sweater", json_response["name"]
  end

  test "create creates a gift" do
    post gifts_path, params: {
      gift: {
        name: "Watch",
        description: "A nice watch",
        cost: 150.00,
        gift_status_id: @status.id,
        holiday_id: @holiday.id
      }
    }, headers: { "Authorization" => @token }, as: :json

    assert_response :created
    assert_equal "Watch", json_response["name"]
  end

  test "update modifies a gift" do
    gift = Gift.create!(name: "Sweater", gift_status: @status, holiday: @holiday)

    patch gift_path(gift), params: {
      gift: { name: "Wool Sweater" }
    }, headers: { "Authorization" => @token }, as: :json

    assert_response :success
    assert_equal "Wool Sweater", json_response["name"]
  end

  test "destroy removes a gift" do
    gift = Gift.create!(name: "Sweater", gift_status: @status, holiday: @holiday)

    assert_difference("Gift.count", -1) do
      delete gift_path(gift), headers: { "Authorization" => @token }, as: :json
    end

    assert_response :no_content
  end
end
