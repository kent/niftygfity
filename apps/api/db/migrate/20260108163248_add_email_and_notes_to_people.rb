class AddEmailAndNotesToPeople < ActiveRecord::Migration[8.1]
  def change
    add_column :people, :email, :string
    add_column :people, :notes, :text
    add_index :people, [:workspace_id, :email], unique: true, where: "email IS NOT NULL", name: "index_people_on_workspace_id_and_email_unique"
  end
end
