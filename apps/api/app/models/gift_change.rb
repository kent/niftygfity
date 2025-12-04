class GiftChange < ApplicationRecord
  enum :change_type, { created: "created", updated: "updated" }

  belongs_to :gift
  belongs_to :holiday
  belongs_to :user

  validates :change_type, presence: true

  scope :pending, -> { where(notified_at: nil) }
  scope :notified, -> { where.not(notified_at: nil) }

  def self.mark_notified!(ids)
    where(id: ids).update_all(notified_at: Time.current)
  end
end

