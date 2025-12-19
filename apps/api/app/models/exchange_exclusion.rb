class ExchangeExclusion < ApplicationRecord
  belongs_to :gift_exchange
  belongs_to :participant_a, class_name: "ExchangeParticipant"
  belongs_to :participant_b, class_name: "ExchangeParticipant"

  validate :participants_are_different
  validate :participants_belong_to_same_exchange
  validate :no_duplicate_exclusion

  def self.exists_between?(participant1, participant2)
    where(participant_a: participant1, participant_b: participant2)
      .or(where(participant_a: participant2, participant_b: participant1))
      .exists?
  end

  private

  def participants_are_different
    return if participant_a_id != participant_b_id
    errors.add(:base, "Participants must be different")
  end

  def participants_belong_to_same_exchange
    return if participant_a&.gift_exchange_id == gift_exchange_id &&
              participant_b&.gift_exchange_id == gift_exchange_id
    errors.add(:base, "Both participants must belong to the same exchange")
  end

  def no_duplicate_exclusion
    return unless gift_exchange_id && participant_a_id && participant_b_id
    return unless ExchangeExclusion.where.not(id: id).exists_between?(participant_a, participant_b)
    errors.add(:base, "This exclusion already exists")
  end
end
