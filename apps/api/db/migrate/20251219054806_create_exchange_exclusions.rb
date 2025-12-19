class CreateExchangeExclusions < ActiveRecord::Migration[8.1]
  def change
    create_table :exchange_exclusions do |t|
      t.references :gift_exchange, null: false, foreign_key: true
      t.bigint :participant_a_id, null: false
      t.bigint :participant_b_id, null: false

      t.timestamps
    end

    add_index :exchange_exclusions, [ :gift_exchange_id, :participant_a_id, :participant_b_id ],
              unique: true, name: "idx_exchange_exclusions_unique"
    add_index :exchange_exclusions, :participant_a_id
    add_index :exchange_exclusions, :participant_b_id

    add_foreign_key :exchange_exclusions, :exchange_participants, column: :participant_a_id
    add_foreign_key :exchange_exclusions, :exchange_participants, column: :participant_b_id
  end
end
