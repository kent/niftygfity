class CreateGiftSuggestions < ActiveRecord::Migration[8.1]
  def change
    create_table :gift_suggestions do |t|
      t.string :name
      t.text :description
      t.string :approximate_price
      t.references :person, null: false, foreign_key: true
      t.references :holiday, null: true, foreign_key: true

      t.timestamps
    end
  end
end
