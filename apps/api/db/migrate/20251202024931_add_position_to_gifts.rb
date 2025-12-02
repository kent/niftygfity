class AddPositionToGifts < ActiveRecord::Migration[8.1]
  def change
    add_column :gifts, :position, :integer, default: 0, null: false
    add_index :gifts, [ :holiday_id, :position ]

    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE gifts SET position = id WHERE position = 0
        SQL
      end
    end
  end
end
