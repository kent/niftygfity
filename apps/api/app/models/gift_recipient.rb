class GiftRecipient < ApplicationRecord
  belongs_to :gift
  belongs_to :person
  belongs_to :shipping_address, class_name: "Address", optional: true

  validate :shipping_address_belongs_to_workspace, if: :shipping_address_id

  private

  def shipping_address_belongs_to_workspace
    return unless shipping_address

    gift_workspace = gift.holiday.workspace
    address_workspace = shipping_address.workspace

    return if gift_workspace == address_workspace

    errors.add(:shipping_address, "must belong to the same workspace")
  end
end
