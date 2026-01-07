class MakeWorkspaceIdNotNull < ActiveRecord::Migration[8.1]
  def change
    # Make workspace_id NOT NULL after data migration has run
    # Note: Holidays with is_template=true may not have a workspace_id
    change_column_null :people, :workspace_id, false
    change_column_null :gift_exchanges, :workspace_id, false
    # holidays.workspace_id stays nullable for template holidays
  end
end
