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
    person = people(:mom)
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
end
