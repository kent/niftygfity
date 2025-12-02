class AddSubscriptionToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :subscription_plan, :string, default: "free", null: false
    add_column :users, :subscription_expires_at, :datetime
    add_column :users, :stripe_customer_id, :string
    add_index :users, :stripe_customer_id, unique: true
  end
end
