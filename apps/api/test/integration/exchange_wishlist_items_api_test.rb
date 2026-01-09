require "test_helper"

class ExchangeWishlistItemsApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @auth_headers = auth_headers_for(@user)
    @workspace = workspaces(:one)
    @exchange = GiftExchange.create!(
      workspace: @workspace,
      user: @user,
      name: "Secret Santa",
      budget_min: 20,
      budget_max: 50
    )
    @participant = @exchange.exchange_participants.create!(
      user: @user,
      name: @user.email,
      email: @user.email,
      status: "accepted"
    )
    @wishlist_item = @participant.exchange_wishlist_items.create!(
      name: "Cozy Sweater",
      description: "Size medium",
      link: "https://example.com/sweater"
    )
  end

  # ============================================================================
  # Index Tests
  # ============================================================================

  test "index returns exchange wishlist items" do
    get gift_exchange_exchange_participant_exchange_wishlist_items_path(@exchange, @participant),
      headers: @auth_headers,
      as: :json
    assert_response :success
    assert_kind_of Array, json_response
    assert json_response.any? { |item| item["id"] == @wishlist_item.id }
  end

  # ============================================================================
  # Show Tests
  # ============================================================================

  test "show returns a wishlist item" do
    get gift_exchange_exchange_participant_exchange_wishlist_item_path(@exchange, @participant, @wishlist_item),
      headers: @auth_headers,
      as: :json
    assert_response :success
    assert_equal @wishlist_item.name, json_response["name"]
  end

  # ============================================================================
  # Create Tests
  # ============================================================================

  test "create adds a wishlist item" do
    assert_difference("ExchangeWishlistItem.count") do
      post gift_exchange_exchange_participant_exchange_wishlist_items_path(@exchange, @participant),
        headers: @auth_headers,
        params: {
          wishlist_item: {
            name: "New Book",
            description: "Any genre is fine",
            link: "https://example.com/book"
          }
        },
        as: :json
    end
    assert_response :created
    assert_equal "New Book", ExchangeWishlistItem.last.name
  end

  # ============================================================================
  # Update Tests
  # ============================================================================

  test "update modifies a wishlist item" do
    patch gift_exchange_exchange_participant_exchange_wishlist_item_path(@exchange, @participant, @wishlist_item),
      headers: @auth_headers,
      params: { wishlist_item: { name: "Updated Item Name" } },
      as: :json
    assert_response :success
    assert_equal "Updated Item Name", @wishlist_item.reload.name
  end

  # ============================================================================
  # Destroy Tests
  # ============================================================================

  test "destroy removes a wishlist item" do
    assert_difference("ExchangeWishlistItem.count", -1) do
      delete gift_exchange_exchange_participant_exchange_wishlist_item_path(@exchange, @participant, @wishlist_item),
        headers: @auth_headers,
        as: :json
    end
    assert_response :success
  end

  # ============================================================================
  # Authentication Tests
  # ============================================================================

  test "requires authentication" do
    get gift_exchange_exchange_participant_exchange_wishlist_items_path(@exchange, @participant), as: :json
    assert_response :unauthorized
  end
end
