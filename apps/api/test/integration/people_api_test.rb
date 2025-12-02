require "test_helper"

class PeopleApiTest < ActionDispatch::IntegrationTest
  setup do
    @user = create_test_user
    post user_session_path, params: { user: { email: @user.email, password: "password123" } }, as: :json
    @token = response.headers["Authorization"]
  end

  test "index returns people for current user" do
    Person.create!(name: "John Doe", user: @user)

    get people_path, headers: { "Authorization" => @token }, as: :json

    assert_response :success
    assert json_response.is_a?(Array)
    assert_equal 1, json_response.length
  end

  test "show returns a person" do
    person = Person.create!(name: "John Doe", user: @user)

    get person_path(person), headers: { "Authorization" => @token }, as: :json

    assert_response :success
    assert_equal "John Doe", json_response["name"]
  end

  test "create creates a person" do
    post people_path, params: {
      person: { name: "Jane Doe", relationship: "Friend" }
    }, headers: { "Authorization" => @token }, as: :json

    assert_response :created
    assert_equal "Jane Doe", json_response["name"]
  end

  test "update modifies a person" do
    person = Person.create!(name: "John Doe", user: @user)

    patch person_path(person), params: {
      person: { name: "John Smith" }
    }, headers: { "Authorization" => @token }, as: :json

    assert_response :success
    assert_equal "John Smith", json_response["name"]
  end

  test "destroy removes a person" do
    person = Person.create!(name: "John Doe", user: @user)

    assert_difference("Person.count", -1) do
      delete person_path(person), headers: { "Authorization" => @token }, as: :json
    end

    assert_response :no_content
  end

  test "cannot access another user's people" do
    other_user = create_test_user(email: "other@example.com")
    person = Person.create!(name: "Secret Person", user: other_user)

    get person_path(person), headers: { "Authorization" => @token }, as: :json

    assert_response :not_found
  end
end
