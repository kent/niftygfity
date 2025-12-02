class GiftStatus < ApplicationRecord
  has_many :gifts, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: true
  validates :position, presence: true

  default_scope { order(:position) }
end
