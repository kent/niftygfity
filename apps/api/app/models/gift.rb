class Gift < ApplicationRecord
  belongs_to :holiday
  belongs_to :gift_status
  has_many :gift_recipients, dependent: :destroy
  has_many :recipients, through: :gift_recipients, source: :person
  has_many :gift_givers, dependent: :destroy
  has_many :givers, through: :gift_givers, source: :person

  validates :name, presence: true

  default_scope { order(:position) }

  before_create :set_position

  # Reorder gifts within a holiday - updates positions for all affected gifts
  def self.reorder_within_holiday(holiday_id, gift_id, new_position)
    transaction do
      gift = unscoped.find(gift_id)
      old_position = gift.position

      return if old_position == new_position

      if new_position > old_position
        # Moving down: shift items between old and new position up
        unscoped.where(holiday_id: holiday_id)
                .where("position > ? AND position <= ?", old_position, new_position)
                .update_all("position = position - 1")
      else
        # Moving up: shift items between new and old position down
        unscoped.where(holiday_id: holiday_id)
                .where("position >= ? AND position < ?", new_position, old_position)
                .update_all("position = position + 1")
      end

      gift.update_column(:position, new_position)
    end
  end

  private

  def set_position
    if position.present? && position > 0
      # Inserting at specific position - shift existing items down
      Gift.unscoped.where(holiday_id: holiday_id)
          .where("position >= ?", position)
          .update_all("position = position + 1")
    else
      # Append to end
      max_pos = Gift.unscoped.where(holiday_id: holiday_id).maximum(:position) || 0
      self.position = max_pos + 1
    end
  end
end
