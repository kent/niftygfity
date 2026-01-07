class WorkspaceMembershipBlueprint < ApplicationBlueprint
  fields :role, :created_at

  field :user_id do |membership|
    membership.user_id
  end

  field :email do |membership|
    membership.user.email
  end

  field :first_name do |membership|
    membership.user.first_name
  end

  field :last_name do |membership|
    membership.user.last_name
  end

  field :image_url do |membership|
    membership.user.image_url
  end

  field :safe_name do |membership|
    membership.user.safe_name
  end
end
