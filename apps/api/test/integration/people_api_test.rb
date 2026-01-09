require "test_helper"

class PeopleApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @auth_headers = auth_headers_for(@user)
  end

  test "index returns people for current user" do
    get people_path, headers: @auth_headers, as: :json
    assert_response :success
    assert_equal 2, json_response.length # mom and dad
  end

  test "show returns a person" do
    person = people(:mom)
    get person_path(person), headers: @auth_headers, as: :json
    assert_response :success
    assert_equal person.name, json_response["name"]
  end

  test "create creates a person" do
    assert_difference("Person.count") do
      post people_path,
        headers: @auth_headers,
        params: { person: { name: "New Person" } },
        as: :json
    end
    assert_response :created
    assert_equal @user.id, Person.last.user_id
  end

  test "update modifies a person" do
    person = people(:mom)
    patch person_path(person),
      headers: @auth_headers,
      params: { person: { name: "Updated Name" } },
      as: :json
    assert_response :success
    assert_equal "Updated Name", person.reload.name
  end

  test "destroy removes a person" do
    # Create a person without gifts attached
    workspace = workspaces(:one)
    person = @user.people.create!(name: "Test Person", workspace: workspace)
    assert_difference("Person.count", -1) do
      delete person_path(person), headers: @auth_headers, as: :json
    end
    assert_response :success
  end

  test "cannot access another user's people" do
    other_person = people(:sister) # belongs to user two
    get person_path(other_person), headers: @auth_headers, as: :json
    assert_response :not_found
  end

  # ============================================================================
  # Shared People Tests
  # ============================================================================

  test "collaborator can view shared person" do
    # User two is a collaborator on christmas, which has mom shared to it
    user_two = users(:two)
    user_two_headers = auth_headers_for(user_two)
    mom = people(:mom)

    get person_path(mom), headers: user_two_headers, as: :json
    assert_response :success
    assert_equal mom.name, json_response["name"]
    assert_equal false, json_response["is_mine"]
  end

  test "collaborator can edit shared person" do
    user_two = users(:two)
    user_two_headers = auth_headers_for(user_two)
    mom = people(:mom)

    patch person_path(mom),
      headers: user_two_headers,
      params: { person: { name: "Mama" } },
      as: :json
    assert_response :success
    assert_equal "Mama", mom.reload.name
  end

  test "collaborator cannot delete shared person" do
    user_two = users(:two)
    user_two_headers = auth_headers_for(user_two)
    mom = people(:mom)

    delete person_path(mom), headers: user_two_headers, as: :json
    assert_response :forbidden
  end

  test "index returns shared people for collaborator" do
    user_two = users(:two)
    # User two is a collaborator on christmas holiday in workspace_one
    # They need to access workspace_one to see shared people from that holiday
    workspace_one = workspaces(:one)
    # Add user_two as a member of workspace_one for this test
    workspace_one.workspace_memberships.create!(user: user_two, role: "member")
    user_two_headers = auth_headers_for(user_two, workspace: workspace_one)

    get people_path, headers: user_two_headers, as: :json
    assert_response :success

    names = json_response.map { |p| p["name"] }
    # User two should see shared "mom" and "dad" from christmas (via holiday collaboration)
    assert_includes names, "Mom"
    assert_includes names, "Dad"
  end

  test "user cannot access person from non-shared holiday" do
    # Create a private holiday for user two with a person
    user_two = users(:two)
    workspace_two = workspaces(:two)
    private_holiday = Holiday.create!(name: "Private Party", workspace: workspace_two)
    private_holiday.holiday_users.create!(user: user_two, role: "owner")
    private_person = user_two.people.create!(name: "Secret Friend", workspace: workspace_two)
    HolidayPerson.create!(holiday: private_holiday, person: private_person)

    # User one should NOT be able to access this person
    get person_path(private_person), headers: @auth_headers, as: :json
    assert_response :not_found
  end

  test "retroactive sharing - new collaborator sees existing people" do
    # Create scenario: user one has a holiday with gifts and people
    # Then invites user two - user two should see the people
    user_one = users(:one)
    user_two = users(:two)
    workspace_one = workspaces(:one)

    new_holiday = Holiday.create!(name: "New Year 2026", workspace: workspace_one)
    new_holiday.holiday_users.create!(user: user_one, role: "owner")
    new_person = user_one.people.create!(name: "Colleague", workspace: workspace_one)
    HolidayPerson.create!(holiday: new_holiday, person: new_person)

    # Before invitation, user two cannot see the person
    user_two_headers = auth_headers_for(user_two)
    get person_path(new_person), headers: user_two_headers, as: :json
    assert_response :not_found

    # After invitation, user two can see and edit the person
    new_holiday.holiday_users.create!(user: user_two, role: "collaborator")

    get person_path(new_person), headers: user_two_headers, as: :json
    assert_response :success
    assert_equal "Colleague", json_response["name"]

    patch person_path(new_person),
      headers: user_two_headers,
      params: { person: { name: "Work Buddy" } },
      as: :json
    assert_response :success
    assert_equal "Work Buddy", new_person.reload.name
  end

  test "index with holiday_id returns people for that holiday" do
    christmas = holidays(:christmas)
    get people_path(holiday_id: christmas.id), headers: @auth_headers, as: :json
    assert_response :success

    names = json_response.map { |p| p["name"] }
    assert_includes names, "Mom"
    assert_includes names, "Dad"
  end
end
