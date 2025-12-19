class CreateGiftExchanges < ActiveRecord::Migration[8.1]
  def change
    create_table :gift_exchanges do |t|
      t.string :name, null: false
      t.date :exchange_date
      t.string :status, null: false, default: "draft"
      t.decimal :budget_min, precision: 10, scale: 2
      t.decimal :budget_max, precision: 10, scale: 2
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :gift_exchanges, :status
    add_index :gift_exchanges, :exchange_date
  end
end
