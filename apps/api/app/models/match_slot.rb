class MatchSlot < ApplicationRecord
  belongs_to :match_arrangement
  belongs_to :person
  belongs_to :gift, optional: true

  validates :row_index, numericality: { greater_than_or_equal_to: 0, allow_nil: false }
  validates :person_id, uniqueness: { scope: [:match_arrangement_id, :row_index] }
  validate :gift_or_group_present

  private

  def gift_or_group_present
    if gift_id.blank? && group_key.blank?
      errors.add(:base, "gift or group must be present")
    elsif gift_id.present? && group_key.present?
      errors.add(:base, "choose either a gift or a group")
    end
  end
end
