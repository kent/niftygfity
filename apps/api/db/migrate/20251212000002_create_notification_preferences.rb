class CreateNotificationPreferences < ActiveRecord::Migration[8.1]
  def change
    create_table :notification_preferences do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.boolean :pending_gifts_reminder_enabled, default: true, null: false
      t.boolean :no_gifts_before_christmas_enabled, default: true, null: false
      t.boolean :no_gift_lists_december_enabled, default: true, null: false
      t.timestamps
    end
  end
end
