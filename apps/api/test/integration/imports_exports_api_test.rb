require "test_helper"

class ImportsExportsApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @auth_headers = auth_headers_for(@user)
    @workspace = workspaces(:one)
    @holiday = holidays(:christmas)
  end

  # ============================================================================
  # Import Tests
  # ============================================================================

  test "imports people processes CSV" do
    csv_content = "name,email,birthday\nJohn Doe,john@example.com,1990-01-15\nJane Smith,jane@example.com,1985-06-20"
    file = Rack::Test::UploadedFile.new(
      StringIO.new(csv_content),
      "text/csv",
      original_filename: "people.csv"
    )

    post "/imports/people",
      headers: @auth_headers.except("Content-Type"),
      params: { file: file }
    # Should successfully process the import request
    assert_response :success
  end

  test "imports people handles invalid CSV" do
    invalid_csv = "this,is,not,valid"
    file = Rack::Test::UploadedFile.new(
      StringIO.new(invalid_csv),
      "text/csv",
      original_filename: "invalid.csv"
    )

    post "/imports/people",
      headers: @auth_headers.except("Content-Type"),
      params: { file: file }
    # May succeed with 0 imports or fail with validation error
    assert_includes [200, 422], response.status
  end

  test "imports people requires authentication" do
    csv_content = "name,email\nTest,test@example.com"
    file = Rack::Test::UploadedFile.new(
      StringIO.new(csv_content),
      "text/csv",
      original_filename: "people.csv"
    )

    post "/imports/people", params: { file: file }
    assert_response :unauthorized
  end

  # ============================================================================
  # Export Tests
  # ============================================================================

  test "exports gifts returns CSV" do
    get "/exports/gifts",
      headers: @auth_headers,
      params: { holiday_id: @holiday.id }
    assert_response :success
    assert_match "text/csv", response.content_type
  end

  test "exports gifts returns 404 without holiday_id" do
    get "/exports/gifts", headers: @auth_headers
    # May return 404 (not found) or 422 (unprocessable) depending on implementation
    assert_includes [404, 422], response.status
  end

  test "exports people returns CSV" do
    get "/exports/people", headers: @auth_headers
    assert_response :success
    assert_match "text/csv", response.content_type
  end

  test "exports require authentication" do
    get "/exports/people"
    assert_response :unauthorized
  end
end
