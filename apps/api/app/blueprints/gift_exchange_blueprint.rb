class GiftExchangeBlueprint < ApplicationBlueprint
  fields :name, :exchange_date, :status, :budget_min, :budget_max, :created_at, :updated_at

  field :user_id do |exchange|
    exchange.user_id
  end

  field :is_owner do |exchange, options|
    options[:current_user] ? exchange.owner?(options[:current_user]) : false
  end

  field :participant_count do |exchange|
    exchange.exchange_participants.count
  end

  field :accepted_count do |exchange|
    exchange.exchange_participants.accepted.count
  end

  field :can_start do |exchange|
    exchange.can_start?
  end

  view :with_participants do
    association :exchange_participants, blueprint: ExchangeParticipantBlueprint
  end

  view :with_my_participation do
    field :my_participant do |exchange, options|
      return nil unless options[:current_user]
      participant = exchange.participant_for(options[:current_user])
      ExchangeParticipantBlueprint.render_as_hash(participant) if participant
    end
  end
end
