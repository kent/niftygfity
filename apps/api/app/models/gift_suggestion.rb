class GiftSuggestion < ApplicationRecord
  belongs_to :person
  belongs_to :holiday, optional: true

  validates :name, presence: true
end
