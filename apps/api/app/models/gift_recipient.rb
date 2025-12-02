class GiftRecipient < ApplicationRecord
  belongs_to :gift
  belongs_to :person
end
