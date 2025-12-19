class ExchangeExclusionBlueprint < ApplicationBlueprint
  fields :created_at, :updated_at

  field :gift_exchange_id do |exclusion|
    exclusion.gift_exchange_id
  end

  field :participant_a_id do |exclusion|
    exclusion.participant_a_id
  end

  field :participant_b_id do |exclusion|
    exclusion.participant_b_id
  end

  field :participant_a do |exclusion|
    {
      id: exclusion.participant_a.id,
      name: exclusion.participant_a.display_name
    }
  end

  field :participant_b do |exclusion|
    {
      id: exclusion.participant_b.id,
      name: exclusion.participant_b.display_name
    }
  end
end
