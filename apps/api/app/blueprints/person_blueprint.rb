class PersonBlueprint < ApplicationBlueprint
  fields :name, :relationship, :age, :gender, :created_at, :updated_at

  field :gift_count do |person|
    person.gifts_received.count + person.gifts_given.count
  end

  view :with_gifts do
    association :gifts_received, blueprint: GiftBlueprint
    association :gifts_given, blueprint: GiftBlueprint
  end
end
