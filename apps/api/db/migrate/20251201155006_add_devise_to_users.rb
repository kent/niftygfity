class AddDeviseToUsers < ActiveRecord::Migration[8.1]
  def change
    change_table :users do |t|
      # Rename email_address to email for Devise
      t.rename :email_address, :email

      # Rename password_digest to encrypted_password for Devise
      t.rename :password_digest, :encrypted_password

      # Recoverable
      t.string :reset_password_token
      t.datetime :reset_password_sent_at

      # Rememberable
      t.datetime :remember_created_at

      # JWT revocation
      t.string :jti, null: false, default: ""
    end

    add_index :users, :reset_password_token, unique: true
    add_index :users, :jti, unique: true

    # Populate jti for existing users
    reversible do |dir|
      dir.up do
        User.reset_column_information
        User.find_each do |user|
          user.update_column(:jti, SecureRandom.uuid)
        end
      end
    end
  end
end
