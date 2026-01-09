class ExchangeWishlistItemBlueprint < ApplicationBlueprint
  fields :name, :description, :link, :price, :created_at, :updated_at

  field :exchange_participant_id do |item|
    item.exchange_participant_id
  end

  field :photo_url do |item|
    next nil unless item.photo.attached?
    Rails.application.routes.url_helpers.rails_blob_path(item.photo, only_path: true)
  end

  field :has_photo do |item|
    item.photo.attached?
  end
end
