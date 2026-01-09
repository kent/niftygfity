class WorkspaceMembership < ApplicationRecord
  ROLES = %w[owner admin member].freeze

  enum :role, { owner: "owner", admin: "admin", member: "member" }, default: :member

  belongs_to :workspace
  belongs_to :user

  validates :role, presence: true, inclusion: { in: ROLES }
  validates :user_id, uniqueness: { scope: :workspace_id }

  # Prevent demoting/removing sole owner
  validate :cannot_demote_sole_owner, on: :update
  before_destroy :cannot_destroy_sole_owner

  private

  def cannot_demote_sole_owner
    return unless role_changed? && role_was == "owner"
    return if workspace.workspace_memberships.where(role: "owner").count > 1

    errors.add(:role, "cannot demote the only owner")
  end

  def cannot_destroy_sole_owner
    return unless owner?
    # Skip this check if the workspace itself is being deleted
    return if destroyed_by_association
    return if workspace.workspace_memberships.where(role: "owner").count > 1

    errors.add(:base, "Cannot remove the only owner")
    throw :abort
  end
end
