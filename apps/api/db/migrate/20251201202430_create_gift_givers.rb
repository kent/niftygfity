class CreateGiftGivers < ActiveRecord::Migration[8.1]
  def change
    create_table :gift_givers do |t|
      t.references :gift, null: false, foreign_key: true
      t.references :person, null: false, foreign_key: true

      t.timestamps
    end
  end
end
