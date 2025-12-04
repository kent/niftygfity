class CreateHolidayPeople < ActiveRecord::Migration[8.1]
  def change
    create_table :holiday_people do |t|
      t.references :holiday, null: false, foreign_key: true
      t.references :person, null: false, foreign_key: true

      t.timestamps
    end

    add_index :holiday_people, [:holiday_id, :person_id], unique: true
  end
end
