class CreateGiftRecipients < ActiveRecord::Migration[8.1]
  def change
    create_table :gift_recipients do |t|
      t.references :gift, null: false, foreign_key: true
      t.references :person, null: false, foreign_key: true

      t.timestamps
    end
  end
end
