class GiftExchange < ApplicationRecord
  STATUSES = %w[draft inviting active completed].freeze

  belongs_to :user
  has_many :exchange_participants, dependent: :destroy
  has_many :users, through: :exchange_participants
  has_many :exchange_exclusions, dependent: :destroy

  validates :name, presence: true
  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :budget_min, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :budget_max, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validate :budget_max_greater_than_min

  scope :owned_by, ->(user) { where(user: user) }
  scope :participating, ->(user) { joins(:exchange_participants).where(exchange_participants: { user: user }) }
  scope :for_user, ->(user) { owned_by(user).or(participating(user)).distinct }

  def owner?(check_user)
    user_id == check_user.id
  end

  def participant_for(check_user)
    exchange_participants.find_by(user: check_user)
  end

  def all_accepted?
    exchange_participants.where.not(status: "accepted").empty?
  end

  def can_start?
    status == "inviting" && all_accepted? && exchange_participants.count >= 3
  end

  private

  def budget_max_greater_than_min
    return if budget_min.blank? || budget_max.blank?
    errors.add(:budget_max, "must be greater than or equal to minimum budget") if budget_max < budget_min
  end
end
