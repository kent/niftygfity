class ExchangeParticipant < ApplicationRecord
  STATUSES = %w[invited accepted declined].freeze

  belongs_to :gift_exchange
  belongs_to :user, optional: true
  belongs_to :matched_participant, class_name: "ExchangeParticipant", optional: true
  has_many :wishlist_items, dependent: :destroy
  has_many :exclusions_as_a, class_name: "ExchangeExclusion", foreign_key: :participant_a_id, dependent: :destroy
  has_many :exclusions_as_b, class_name: "ExchangeExclusion", foreign_key: :participant_b_id, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :invite_token, presence: true, uniqueness: true
  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :email, uniqueness: { scope: :gift_exchange_id, message: "is already a participant" }

  before_validation :generate_invite_token, on: :create

  scope :invited, -> { where(status: "invited") }
  scope :accepted, -> { where(status: "accepted") }
  scope :declined, -> { where(status: "declined") }

  def accept!(accepting_user)
    update!(user: accepting_user, status: "accepted")
  end

  def decline!
    update!(status: "declined")
  end

  def display_name
    user&.first_name.presence || name
  end

  def excluded_from?(other_participant)
    ExchangeExclusion.exists_between?(self, other_participant)
  end

  private

  def generate_invite_token
    self.invite_token ||= SecureRandom.urlsafe_base64(32)
  end
end
