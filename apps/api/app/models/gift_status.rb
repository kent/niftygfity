class GiftStatus < ApplicationRecord
  has_many :gifts, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: true
  validates :position, presence: true

  # NOTE: Explicitly use `by_position` scope where ordering is needed
  # Avoid default_scope as it causes unexpected behavior in joins/associations
  scope :by_position, -> { order(:position) }
end
