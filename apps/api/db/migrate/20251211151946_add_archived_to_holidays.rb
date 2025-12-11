class AddArchivedToHolidays < ActiveRecord::Migration[8.1]
  def change
    add_column :holidays, :archived, :boolean, default: false, null: false
  end
end
