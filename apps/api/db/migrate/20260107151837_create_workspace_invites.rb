class CreateWorkspaceInvites < ActiveRecord::Migration[8.1]
  def change
    create_table :workspace_invites do |t|
      t.references :workspace, null: false, foreign_key: true
      t.references :invited_by, null: false, foreign_key: { to_table: :users }
      t.string :token, null: false
      t.string :role, null: false, default: 'member'
      t.datetime :expires_at, null: false
      t.datetime :accepted_at
      t.references :accepted_by, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :workspace_invites, :token, unique: true
    add_index :workspace_invites, [ :workspace_id, :expires_at ]
  end
end
