class CreateStandaloneWishlistItems < ActiveRecord::Migration[8.1]
  def change
    create_table :wishlist_items do |t|
      t.references :wishlist, null: false, foreign_key: true
      t.string :name, null: false
      t.text :notes
      t.string :url
      t.decimal :price_min, precision: 10, scale: 2
      t.decimal :price_max, precision: 10, scale: 2
      t.integer :priority, null: false, default: 0
      t.integer :quantity, null: false, default: 1
      t.integer :position, null: false, default: 0
      t.string :image_url
      t.datetime :archived_at

      t.timestamps

      t.index [ :wishlist_id, :position ]
      t.index [ :wishlist_id, :archived_at ]
    end
  end
end
