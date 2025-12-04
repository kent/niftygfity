class HolidayUser < ApplicationRecord
  enum :role, { owner: "owner", collaborator: "collaborator" }, default: :collaborator

  belongs_to :holiday
  belongs_to :user

  validates :user_id, uniqueness: { scope: :holiday_id }
end

