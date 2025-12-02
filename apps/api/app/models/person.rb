class Person < ApplicationRecord
  belongs_to :user
  has_many :gift_recipients, dependent: :destroy
  has_many :gifts_received, through: :gift_recipients, source: :gift
  has_many :gift_givers, dependent: :destroy
  has_many :gifts_given, through: :gift_givers, source: :gift
  has_many :gift_suggestions, dependent: :destroy

  validates :name, presence: true
end
