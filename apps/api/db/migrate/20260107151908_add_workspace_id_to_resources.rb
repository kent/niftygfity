class AddWorkspaceIdToResources < ActiveRecord::Migration[8.1]
  def change
    # Add workspace_id to people (nullable first, will be made NOT NULL after data migration)
    add_reference :people, :workspace, foreign_key: true

    # Add workspace_id to holidays (nullable first)
    add_reference :holidays, :workspace, foreign_key: true

    # Add workspace_id to gift_exchanges (nullable first)
    add_reference :gift_exchanges, :workspace, foreign_key: true

    # Add indexes for efficient querying
    add_index :people, [ :workspace_id, :user_id ]
    add_index :holidays, [ :workspace_id, :is_template ]
    add_index :gift_exchanges, [ :workspace_id, :user_id ]
  end
end
