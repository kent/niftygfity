require "test_helper"

class CompanyProfilesApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @business_workspace = Workspace.create!(
      name: "Business Workspace",
      workspace_type: "business",
      created_by_user: @user
    )
    @business_workspace.workspace_memberships.create!(user: @user, role: "owner")
    @company_profile = @business_workspace.create_company_profile!(name: "Test Company")
    @auth_headers = auth_headers_for(@user, workspace: @business_workspace)
  end

  # ============================================================================
  # Show Tests
  # ============================================================================

  test "show returns company profile" do
    get workspace_company_profile_path(@business_workspace), headers: @auth_headers, as: :json
    assert_response :success
    assert_equal @company_profile.name, json_response["name"]
  end

  test "show requires business workspace" do
    personal_workspace = workspaces(:one)
    personal_headers = auth_headers_for(@user, workspace: personal_workspace)
    get workspace_company_profile_path(personal_workspace), headers: personal_headers, as: :json
    assert_response :unprocessable_entity
  end

  # ============================================================================
  # Update Tests
  # ============================================================================

  test "update modifies company profile" do
    patch workspace_company_profile_path(@business_workspace),
      headers: @auth_headers,
      params: { company_profile: { name: "Updated Company Name" } },
      as: :json
    assert_response :success
    assert_equal "Updated Company Name", @company_profile.reload.name
  end

  test "update can set website and address" do
    patch workspace_company_profile_path(@business_workspace),
      headers: @auth_headers,
      params: {
        company_profile: {
          website: "https://example.com",
          address: "123 Business St, Suite 100"
        }
      },
      as: :json
    assert_response :success
    @company_profile.reload
    assert_equal "https://example.com", @company_profile.website
    assert_equal "123 Business St, Suite 100", @company_profile.address
  end

  # ============================================================================
  # Authentication Tests
  # ============================================================================

  test "requires authentication" do
    get workspace_company_profile_path(@business_workspace), as: :json
    assert_response :unauthorized
  end
end
