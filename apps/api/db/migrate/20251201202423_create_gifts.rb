class CreateGifts < ActiveRecord::Migration[8.1]
  def change
    create_table :gifts do |t|
      t.string :name
      t.text :description
      t.string :link
      t.decimal :cost, precision: 10, scale: 2
      t.references :holiday, null: false, foreign_key: true
      t.references :gift_status, null: false, foreign_key: true

      t.timestamps
    end
  end
end
