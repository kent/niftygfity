class AddClerkProfileFieldsToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :image_url, :string
    add_column :users, :phone, :string
    add_column :users, :username, :string
  end
end
