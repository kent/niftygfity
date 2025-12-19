class CreateWishlistItems < ActiveRecord::Migration[8.1]
  def change
    create_table :wishlist_items do |t|
      t.references :exchange_participant, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.string :link
      t.decimal :price, precision: 10, scale: 2

      t.timestamps
    end

    add_index :wishlist_items, :name
  end
end
