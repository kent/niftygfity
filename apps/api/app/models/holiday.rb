class Holiday < ApplicationRecord
  has_secure_token :share_token

  has_many :holiday_users, dependent: :destroy
  has_many :users, through: :holiday_users
  has_many :holiday_people, dependent: :destroy
  has_many :shared_people, through: :holiday_people, source: :person
  has_many :gifts, dependent: :destroy
  has_many :gift_changes, dependent: :destroy
  has_many :gift_suggestions, dependent: :nullify

  validates :name, presence: true

  scope :templates, -> { where(is_template: true) }
  scope :user_holidays, -> { where(is_template: false) }

  def owner
    holiday_users.find_by(role: "owner")&.user
  end

  def owner?(user)
    holiday_users.exists?(user: user, role: "owner")
  end

  def collaborator?(user)
    holiday_users.exists?(user: user, role: "collaborator")
  end

  def member?(user)
    holiday_users.exists?(user: user)
  end

  def regenerate_share_token!
    regenerate_share_token
    save!
  end
end
