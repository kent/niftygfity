class AddCreatedByToGifts < ActiveRecord::Migration[8.1]
  def change
    add_column :gifts, :created_by_user_id, :integer
    add_index :gifts, :created_by_user_id
    add_foreign_key :gifts, :users, column: :created_by_user_id

    # Backfill existing gifts with holiday owner as creator
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE gifts
          SET created_by_user_id = (
            SELECT holiday_users.user_id
            FROM holiday_users
            WHERE holiday_users.holiday_id = gifts.holiday_id
              AND holiday_users.role = 'owner'
            LIMIT 1
          )
          WHERE created_by_user_id IS NULL
        SQL
      end
    end
  end
end
