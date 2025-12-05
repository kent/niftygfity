class UserBlueprint < ApplicationBlueprint
  fields :email, :first_name, :last_name, :created_at, :subscription_plan, :subscription_expires_at

  field :gift_count do |user|
    user.gift_count
  end

  field :gifts_remaining do |user|
    user.gifts_remaining
  end

  field :can_create_gift do |user|
    user.can_create_gift?
  end

  field :subscription_status do |user|
    user.subscription_status
  end

  # Minimal view for collaborator display
  view :minimal do
    fields :email
  end
end
