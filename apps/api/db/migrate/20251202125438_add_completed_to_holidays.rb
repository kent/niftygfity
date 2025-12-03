class AddCompletedToHolidays < ActiveRecord::Migration[8.1]
  def change
    add_column :holidays, :completed, :boolean, default: false, null: false
  end
end
