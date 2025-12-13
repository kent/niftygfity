class AddEmailPreferencesTokenToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :email_preferences_token, :string
    add_index :users, :email_preferences_token, unique: true
  end
end

