class MatchArrangementBlueprint < ApplicationBlueprint
  fields :holiday_id, :title, :person_ids, :groupings, :created_at, :updated_at

  association :match_slots, blueprint: MatchSlotBlueprint, name: :slots
end
