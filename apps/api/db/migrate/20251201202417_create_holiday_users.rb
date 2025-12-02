class CreateHolidayUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :holiday_users do |t|
      t.references :holiday, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
