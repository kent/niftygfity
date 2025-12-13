class CreateEmailDeliveries < ActiveRecord::Migration[8.1]
  def change
    create_table :email_deliveries do |t|
      t.references :user, null: false, foreign_key: true
      t.references :holiday, null: true, foreign_key: true
      t.string :kind, null: false
      t.string :to_email, null: false
      t.string :subject, null: false
      t.datetime :sent_at, null: false
      t.string :status, null: false, default: "sent"
      t.text :error
      t.string :dedupe_key, null: false
      t.jsonb :metadata, default: {}
      t.timestamps
    end

    add_index :email_deliveries, [:user_id, :kind, :dedupe_key], unique: true, name: "idx_email_deliveries_dedupe"
    add_index :email_deliveries, [:user_id, :kind, :sent_at]
    add_index :email_deliveries, :kind
  end
end

