class MatchArrangement < ApplicationRecord
  belongs_to :holiday
  has_many :match_slots, dependent: :destroy

  attribute :groupings, default: []

  validates :holiday, presence: true
  validate :person_ids_limit
  validate :groupings_format

  MAX_PEOPLE = 4

  private

  def person_ids_limit
    if person_ids.length > MAX_PEOPLE
      errors.add(:person_ids, "cannot exceed #{MAX_PEOPLE} people")
    end
  end

  def groupings_format
    return if groupings.blank?

    unless groupings.is_a?(Array)
      errors.add(:groupings, "must be an array")
      return
    end

    groupings.each do |group|
      unless group.is_a?(Hash) && group["id"].present? && group["person_id"].present? && group["gift_ids"].is_a?(Array)
        errors.add(:groupings, "must include id, person_id, gift_ids")
        break
      end
    end
  end
end
