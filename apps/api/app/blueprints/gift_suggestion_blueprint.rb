class GiftSuggestionBlueprint < ApplicationBlueprint
  fields :name, :description, :approximate_price, :person_id, :holiday_id, :created_at, :updated_at

  association :holiday, blueprint: HolidayBlueprint
end
