require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "downcases and strips email_address" do
    user = User.new(email_address: " DOWNCASED@EXAMPLE.COM ")
    assert_equal("downcased@example.com", user.email_address)
  end

  test "has many people" do
    user = users(:one)
    assert_includes user.people, people(:mom)
    assert_includes user.people, people(:dad)
  end

  test "has many holidays through holiday_users" do
    user = users(:one)
    assert_includes user.holidays, holidays(:christmas)
    assert_includes user.holidays, holidays(:birthday)
  end
end
