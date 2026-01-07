class MigrateExistingUsersToWorkspaces < ActiveRecord::Migration[8.1]
  def up
    # Skip if no users exist (fresh install)
    return unless table_exists?(:users) && User.exists?

    say_with_time "Creating personal workspaces for existing users" do
      User.find_each do |user|
        # Create personal workspace
        workspace = execute_insert_workspace(user)
        workspace_id = workspace.first["id"]

        # Create owner membership
        execute_insert_membership(workspace_id, user.id)

        # Associate existing people
        execute(<<-SQL.squish)
          UPDATE people
          SET workspace_id = #{workspace_id}
          WHERE user_id = #{user.id}
          AND workspace_id IS NULL
        SQL
      end
    end

    say_with_time "Associating holidays to owner's workspace" do
      # For each holiday, find the owner and associate to their workspace
      execute(<<-SQL.squish)
        UPDATE holidays
        SET workspace_id = (
          SELECT w.id
          FROM workspaces w
          INNER JOIN workspace_memberships wm ON wm.workspace_id = w.id AND wm.role = 'owner'
          INNER JOIN holiday_users hu ON hu.user_id = wm.user_id AND hu.role = 'owner'
          WHERE hu.holiday_id = holidays.id
          AND w.workspace_type = 'personal'
          LIMIT 1
        )
        WHERE workspace_id IS NULL
        AND is_template = false
      SQL
    end

    say_with_time "Associating gift exchanges to owner's workspace" do
      execute(<<-SQL.squish)
        UPDATE gift_exchanges
        SET workspace_id = (
          SELECT w.id
          FROM workspaces w
          INNER JOIN workspace_memberships wm ON wm.workspace_id = w.id AND wm.role = 'owner'
          WHERE wm.user_id = gift_exchanges.user_id
          AND w.workspace_type = 'personal'
          LIMIT 1
        )
        WHERE workspace_id IS NULL
      SQL
    end
  end

  def down
    # Clear workspace associations (data is preserved, just unlinked)
    execute("UPDATE people SET workspace_id = NULL")
    execute("UPDATE holidays SET workspace_id = NULL")
    execute("UPDATE gift_exchanges SET workspace_id = NULL")

    # Remove workspace data
    execute("DELETE FROM workspace_memberships")
    execute("DELETE FROM company_profiles")
    execute("DELETE FROM workspace_invites")
    execute("DELETE FROM workspaces")
  end

  private

  def execute_insert_workspace(user)
    workspace_name = user.first_name.presence || user.email.split("@").first
    workspace_name = "#{workspace_name}'s Workspace"

    execute(<<-SQL.squish)
      INSERT INTO workspaces (name, workspace_type, created_by_user_id, created_at, updated_at)
      VALUES ('#{connection.quote_string(workspace_name)}', 'personal', #{user.id}, NOW(), NOW())
      RETURNING id
    SQL
  end

  def execute_insert_membership(workspace_id, user_id)
    execute(<<-SQL.squish)
      INSERT INTO workspace_memberships (workspace_id, user_id, role, created_at, updated_at)
      VALUES (#{workspace_id}, #{user_id}, 'owner', NOW(), NOW())
    SQL
  end
end
