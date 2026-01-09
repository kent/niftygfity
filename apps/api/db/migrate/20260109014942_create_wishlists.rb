class CreateWishlists < ActiveRecord::Migration[8.1]
  def change
    create_table :wishlists do |t|
      t.references :user, null: false, foreign_key: true
      t.references :workspace, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.string :visibility, null: false, default: "private"
      t.string :share_token
      t.boolean :anti_spoiler_enabled, null: false, default: true
      t.date :target_date

      t.timestamps

      t.index :share_token, unique: true
      t.index [:workspace_id, :user_id]
      t.index [:visibility, :workspace_id]
    end
  end
end
