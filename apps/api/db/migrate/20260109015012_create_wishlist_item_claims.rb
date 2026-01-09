class CreateWishlistItemClaims < ActiveRecord::Migration[8.1]
  def change
    create_table :wishlist_item_claims do |t|
      t.references :wishlist_item, null: false, foreign_key: true
      t.references :user, foreign_key: true  # Nullable for guest claims
      t.string :claimer_name
      t.string :claimer_email
      t.string :claim_token
      t.string :status, null: false, default: "reserved"
      t.integer :quantity, null: false, default: 1
      t.text :message
      t.datetime :claimed_at, null: false
      t.datetime :purchased_at
      t.datetime :revealed_at

      t.timestamps

      t.index :claim_token, unique: true
      t.index [:wishlist_item_id, :user_id], unique: true, where: "user_id IS NOT NULL", name: "idx_unique_user_claim_per_item"
      t.index [:wishlist_item_id, :claimer_email], unique: true, where: "claimer_email IS NOT NULL", name: "idx_unique_guest_claim_per_item"
      t.index :status
    end
  end
end
