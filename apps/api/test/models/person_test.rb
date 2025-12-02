require "test_helper"

class PersonTest < ActiveSupport::TestCase
  test "requires name" do
    person = Person.new(user: users(:one))
    assert_not person.valid?
    assert_includes person.errors[:name], "can't be blank"
  end

  test "belongs to user" do
    person = people(:mom)
    assert_equal users(:one), person.user
  end

  test "has many gifts_received through gift_recipients" do
    person = people(:mom)
    assert_includes person.gifts_received, gifts(:sweater)
    assert_includes person.gifts_received, gifts(:book)
  end

  test "has many gifts_given through gift_givers" do
    person = people(:sister)
    assert_includes person.gifts_given, gifts(:sweater)
  end
end
