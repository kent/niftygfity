class CreateExchangeParticipants < ActiveRecord::Migration[8.1]
  def change
    create_table :exchange_participants do |t|
      t.references :gift_exchange, null: false, foreign_key: true
      t.references :user, null: true, foreign_key: true
      t.string :name, null: false
      t.string :email, null: false
      t.string :invite_token, null: false
      t.string :status, null: false, default: "invited"
      t.bigint :matched_participant_id

      t.timestamps
    end

    add_index :exchange_participants, :invite_token, unique: true
    add_index :exchange_participants, :email
    add_index :exchange_participants, :status
    add_index :exchange_participants, :matched_participant_id
    add_index :exchange_participants, [:gift_exchange_id, :email], unique: true

    add_foreign_key :exchange_participants, :exchange_participants, column: :matched_participant_id
  end
end
