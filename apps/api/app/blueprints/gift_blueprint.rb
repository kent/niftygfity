class GiftBlueprint < ApplicationBlueprint
  fields :name, :description, :link, :cost, :holiday_id, :gift_status_id, :position, :created_at, :updated_at

  association :gift_status, blueprint: GiftStatusBlueprint
  association :holiday, blueprint: HolidayBlueprint
  association :recipients, blueprint: PersonBlueprint
  association :givers, blueprint: PersonBlueprint
end
