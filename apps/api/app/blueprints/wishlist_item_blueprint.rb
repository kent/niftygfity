class WishlistItemBlueprint < ApplicationBlueprint
  fields :name, :notes, :url, :price_min, :price_max, :priority, :quantity, :position, :image_url, :created_at, :updated_at

  field :wishlist_id do |item|
    item.wishlist_id
  end

  field :is_available do |item|
    !item.fully_claimed?
  end

  field :available_quantity do |item|
    item.available_quantity
  end

  field :claimed_quantity do |item|
    item.claimed_quantity
  end

  field :price_display do |item|
    item.price_display
  end

  field :archived_at do |item|
    item.archived_at
  end

  field :claim_count do |item|
    # Use size to work with preloaded associations, count for queries
    item.claims.loaded? ? item.claims.size : item.claims.count
  end

  # Current user's claim on this item (if any)
  field :my_claim do |item, options|
    next nil unless options[:current_user]
    claim = item.claims.find { |c| c.user_id == options[:current_user].id }
    WishlistItemClaimBlueprint.render_as_hash(claim) if claim
  end

  # Claims are shown based on view context
  # - Owner with anti_spoiler: only revealed claims
  # - Non-owner or anti_spoiler off: all claims
  # - Public view: no claimer details, just counts
  field :claims do |item, options|
    wishlist = item.wishlist
    current_user = options[:current_user]
    is_owner = current_user && wishlist.owner?(current_user)

    if options[:public_view]
      # Public view: just show claim status, no details
      item.claims.map do |claim|
        { status: claim.status, quantity: claim.quantity }
      end
    elsif is_owner && wishlist.anti_spoiler_enabled
      # Owner with anti-spoiler: only show revealed claims
      revealed_claims = item.claims.revealed
      WishlistItemClaimBlueprint.render_as_hash(revealed_claims)
    else
      # Non-owner or anti-spoiler off: show all claims
      WishlistItemClaimBlueprint.render_as_hash(item.claims)
    end
  end
end
