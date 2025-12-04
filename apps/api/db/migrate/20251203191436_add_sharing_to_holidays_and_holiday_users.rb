class AddSharingToHolidaysAndHolidayUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :holiday_users, :role, :string, default: "collaborator", null: false
    add_column :holidays, :share_token, :string
    add_index :holidays, :share_token, unique: true

    # Set existing holiday_users to "owner" (they were the creators)
    reversible do |dir|
      dir.up do
        execute "UPDATE holiday_users SET role = 'owner'"
      end
    end
  end
end
