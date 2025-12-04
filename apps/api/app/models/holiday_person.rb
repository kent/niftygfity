class HolidayPerson < ApplicationRecord
  belongs_to :holiday
  belongs_to :person

  validates :holiday_id, uniqueness: { scope: :person_id }
end
