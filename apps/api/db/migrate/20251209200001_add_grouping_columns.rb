class AddGroupingColumns < ActiveRecord::Migration[8.1]
  def change
    add_column :match_arrangements, :groupings, :jsonb, default: [], null: false unless column_exists?(:match_arrangements, :groupings)
    add_column :match_slots, :group_key, :string, null: true unless column_exists?(:match_slots, :group_key)
  end
end
