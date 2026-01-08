class AddShippingAddressToGiftRecipients < ActiveRecord::Migration[8.1]
  def change
    add_reference :gift_recipients, :shipping_address, null: true, foreign_key: { to_table: :addresses }
  end
end
