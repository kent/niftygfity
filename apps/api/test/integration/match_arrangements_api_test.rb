require "test_helper"

class MatchArrangementsApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @auth_headers = auth_headers_for(@user)
    @holiday = holidays(:christmas)
    @arrangement = match_arrangements(:one)
  end

  test "index returns arrangements" do
    get match_arrangements_path, headers: @auth_headers, as: :json
    assert_response :success
    assert_kind_of Array, json_response
  end

  test "show returns an arrangement with slots" do
    get match_arrangement_path(@arrangement), headers: @auth_headers, as: :json
    assert_response :success
    assert_equal @arrangement.title, json_response["title"]
    assert json_response.key?("slots")
  end

  test "create creates an arrangement" do
    assert_difference("MatchArrangement.count") do
      post match_arrangements_path,
        headers: @auth_headers,
        params: {
          match_arrangement: {
            holiday_id: @holiday.id,
            title: "New Comparison",
            person_ids: [ people(:mom).id, people(:dad).id ]
          }
        },
        as: :json
    end
    assert_response :created
  end

  test "update modifies an arrangement" do
    patch match_arrangement_path(@arrangement),
      headers: @auth_headers,
      params: { match_arrangement: { title: "Updated Title" } },
      as: :json
    assert_response :success
    assert_equal "Updated Title", @arrangement.reload.title
  end

  test "update can sync slots" do
    patch match_arrangement_path(@arrangement),
      headers: @auth_headers,
      params: {
        match_arrangement: {
          slots: [
            { person_id: people(:mom).id, gift_id: gifts(:sweater).id, row_index: 0 },
            { person_id: people(:dad).id, gift_id: nil, group_key: "group_1", row_index: 0 }
          ]
        }
      },
      as: :json
    assert_response :success
  end

  test "destroy removes an arrangement" do
    assert_difference("MatchArrangement.count", -1) do
      delete match_arrangement_path(@arrangement), headers: @auth_headers, as: :json
    end
    assert_response :success
  end

  test "by_holiday returns arrangements for a holiday" do
    get holiday_match_arrangements_path(@holiday), headers: @auth_headers, as: :json
    assert_response :success
    assert_kind_of Array, json_response
  end
end
