class AddShowGiftAddressesToWorkspaces < ActiveRecord::Migration[8.1]
  def change
    # Default to false (personal workspaces don't need addresses typically)
    add_column :workspaces, :show_gift_addresses, :boolean, default: false, null: false

    # Set existing business workspaces to true (they typically need addresses)
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE workspaces SET show_gift_addresses = true WHERE workspace_type = 'business'
        SQL
      end
    end
  end
end
