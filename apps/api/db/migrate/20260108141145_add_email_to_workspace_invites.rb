class AddEmailToWorkspaceInvites < ActiveRecord::Migration[8.1]
  def change
    add_column :workspace_invites, :email, :string
  end
end
