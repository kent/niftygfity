class CreateMatchArrangements < ActiveRecord::Migration[8.1]
  def change
    create_table :match_arrangements do |t|
      t.references :holiday, null: false, foreign_key: true
      t.string :title, default: "Gift Comparison"
      t.integer :person_ids, array: true, default: []
      t.jsonb :groupings, default: []

      t.timestamps
    end

    create_table :match_slots do |t|
      t.references :match_arrangement, null: false, foreign_key: true
      t.references :person, null: false, foreign_key: true
      t.references :gift, null: true, foreign_key: true
      t.string :group_key, null: true
      t.integer :row_index, null: false, default: 0

      t.timestamps
    end

    add_index :match_slots, [ :match_arrangement_id, :person_id, :row_index ],
              unique: true, name: "idx_match_slots_unique"
  end
end
