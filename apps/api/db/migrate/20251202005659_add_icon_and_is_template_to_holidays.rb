class AddIconAndIsTemplateToHolidays < ActiveRecord::Migration[8.1]
  def change
    add_column :holidays, :icon, :string
    add_column :holidays, :is_template, :boolean, default: false, null: false
  end
end
