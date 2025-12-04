class AddDigestPreferencesToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :digest_enabled, :boolean, default: true, null: false
    add_column :users, :last_digest_sent_at, :datetime
  end
end
