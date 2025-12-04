class CreateGiftChanges < ActiveRecord::Migration[8.1]
  def change
    create_table :gift_changes do |t|
      t.references :gift, null: false, foreign_key: true
      t.references :holiday, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :change_type, null: false
      t.jsonb :changes_data, default: {}
      t.datetime :notified_at

      t.timestamps
    end

    add_index :gift_changes, :notified_at
    add_index :gift_changes, [:holiday_id, :notified_at]
  end
end

