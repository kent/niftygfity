class CreateCompanyProfiles < ActiveRecord::Migration[8.1]
  def change
    create_table :company_profiles do |t|
      t.references :workspace, null: false, foreign_key: true, index: { unique: true }
      t.string :name, null: false
      t.string :website
      t.text :address
      t.jsonb :tax_metadata, default: {}

      t.timestamps
    end
  end
end
