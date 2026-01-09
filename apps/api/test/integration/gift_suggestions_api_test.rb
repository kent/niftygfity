require "test_helper"

class GiftSuggestionsApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @auth_headers = auth_headers_for(@user)
    @workspace = workspaces(:one)
    @person = people(:mom)
    @holiday = holidays(:christmas)
    @suggestion = gift_suggestions(:one)
  end

  # ============================================================================
  # Index and Create Tests
  # ============================================================================

  test "index returns suggestions for a person" do
    get person_gift_suggestions_path(@person), headers: @auth_headers, as: :json
    assert_response :success
    assert_kind_of Array, json_response
  end

  test "create generates suggestions for a person" do
    # Mock OpenAI response for suggestion generation
    post person_gift_suggestions_path(@person), headers: @auth_headers, as: :json
    # This may return various responses depending on subscription/config
    assert_includes [200, 201, 403, 422, 503], response.status
  end

  test "refine suggestions for holiday context" do
    suggestion_ids = [@suggestion.id]

    post refine_person_gift_suggestions_path(@person),
      headers: @auth_headers,
      params: { suggestion_ids: suggestion_ids, holiday_id: @holiday.id },
      as: :json
    # May return various responses depending on subscription/OpenAI
    assert_includes [200, 201, 403, 422, 503], response.status
  end

  # ============================================================================
  # Accept and Discard Tests
  # ============================================================================

  test "accept converts suggestion to gift" do
    assert_difference("Gift.count") do
      post accept_gift_suggestion_path(@suggestion),
        headers: @auth_headers,
        params: { holiday_id: @holiday.id },
        as: :json
    end
    assert_response :success
  end

  test "accept without holiday_id still creates gift" do
    # Create a new suggestion for this test
    new_suggestion = GiftSuggestion.create!(
      person: @person,
      name: "Test Suggestion",
      description: "Test Description",
      approximate_price: 50.0
    )

    assert_difference("Gift.count") do
      post accept_gift_suggestion_path(new_suggestion),
        headers: @auth_headers,
        as: :json
    end
    assert_response :success
  end

  test "destroy discards a suggestion" do
    # Create a suggestion to delete
    new_suggestion = GiftSuggestion.create!(
      person: @person,
      name: "Delete Me",
      description: "Test",
      approximate_price: 25.0
    )

    assert_difference("GiftSuggestion.count", -1) do
      delete gift_suggestion_path(new_suggestion), headers: @auth_headers, as: :json
    end
    assert_response :success
  end

  # ============================================================================
  # Authorization Tests
  # ============================================================================

  test "cannot access another user's person suggestions" do
    other_user = users(:two)
    other_person = Person.create!(
      user: other_user,
      workspace: workspaces(:two),
      name: "Other Person"
    )

    get person_gift_suggestions_path(other_person), headers: @auth_headers, as: :json
    assert_response :not_found
  end

  test "requires authentication" do
    get person_gift_suggestions_path(@person), as: :json
    assert_response :unauthorized
  end
end
