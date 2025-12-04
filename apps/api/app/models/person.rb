class Person < ApplicationRecord
  belongs_to :user
  has_many :gift_recipients, dependent: :destroy
  has_many :gifts_received, through: :gift_recipients, source: :gift
  has_many :gift_givers, dependent: :destroy
  has_many :gifts_given, through: :gift_givers, source: :gift
  has_many :gift_suggestions, dependent: :destroy
  has_many :holiday_people, dependent: :destroy
  has_many :shared_holidays, through: :holiday_people, source: :holiday

  validates :name, presence: true

  # Check if person is shared to a specific holiday
  def shared_to?(holiday)
    holiday_people.exists?(holiday: holiday)
  end

  # Check if user can access this person (owns them or they're shared to a common holiday)
  def accessible_by?(user)
    return true if self.user_id == user.id
    shared_holidays.joins(:holiday_users).where(holiday_users: { user_id: user.id }).exists?
  end
end
