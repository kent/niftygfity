class HolidayBlueprint < ApplicationBlueprint
  fields :name, :date, :icon, :is_template, :completed, :created_at, :updated_at

  view :with_gifts do
    association :gifts, blueprint: GiftBlueprint
  end
end
