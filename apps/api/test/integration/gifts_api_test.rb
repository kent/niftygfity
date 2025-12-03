require "test_helper"

class GiftsApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @auth_headers = auth_headers_for(@user)
    @holiday = holidays(:christmas)
    @status = gift_statuses(:idea)
  end

  test "index returns gifts" do
    get gifts_path, headers: @auth_headers, as: :json
    assert_response :success
  end

  test "show returns a gift" do
    gift = gifts(:sweater)
    get gift_path(gift), headers: @auth_headers, as: :json
    assert_response :success
    assert_equal gift.name, json_response["name"]
  end

  test "create creates a gift" do
    assert_difference("Gift.count") do
      post gifts_path,
        headers: @auth_headers,
        params: {
          gift: {
            name: "New Gift",
            holiday_id: @holiday.id,
            gift_status_id: @status.id
          }
        },
        as: :json
    end
    assert_response :created
  end

  test "update modifies a gift" do
    gift = gifts(:sweater)
    patch gift_path(gift),
      headers: @auth_headers,
      params: { gift: { name: "Updated Gift" } },
      as: :json
    assert_response :success
    assert_equal "Updated Gift", gift.reload.name
  end

  test "destroy removes a gift" do
    gift = gifts(:sweater)
    assert_difference("Gift.count", -1) do
      delete gift_path(gift), headers: @auth_headers, as: :json
    end
    assert_response :success
  end
end
