class WorkspaceInviteBlueprint < ApplicationBlueprint
  fields :role, :expires_at, :created_at

  field :token do |invite|
    invite.token
  end

  field :invite_url do |invite|
    invite.invite_url
  end

  field :invited_by_name do |invite|
    invite.invited_by.safe_name
  end

  field :is_valid do |invite|
    invite.valid_invite?
  end
end
