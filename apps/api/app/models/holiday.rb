class Holiday < ApplicationRecord
  has_many :holiday_users, dependent: :destroy
  has_many :users, through: :holiday_users
  has_many :gifts, dependent: :destroy
  has_many :gift_suggestions, dependent: :nullify

  validates :name, presence: true

  scope :templates, -> { where(is_template: true) }
  scope :user_holidays, -> { where(is_template: false) }
end
