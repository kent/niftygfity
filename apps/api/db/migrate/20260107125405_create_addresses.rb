class CreateAddresses < ActiveRecord::Migration[8.1]
  def change
    create_table :addresses do |t|
      t.references :company_profile, null: false, foreign_key: true
      t.string :label, null: false
      t.string :street_line_1, null: false
      t.string :street_line_2
      t.string :city, null: false
      t.string :state
      t.string :postal_code, null: false
      t.string :country, null: false, default: "CA"
      t.boolean :is_default, default: false, null: false

      t.timestamps
    end

    add_index :addresses, [ :company_profile_id, :label ], unique: true
    add_index :addresses, [ :company_profile_id, :is_default ]
  end
end
