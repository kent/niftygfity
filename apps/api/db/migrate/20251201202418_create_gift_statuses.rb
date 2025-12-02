class CreateGiftStatuses < ActiveRecord::Migration[8.1]
  def change
    create_table :gift_statuses do |t|
      t.string :name
      t.integer :position

      t.timestamps
    end
  end
end
