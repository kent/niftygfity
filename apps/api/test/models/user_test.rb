require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "downcases and strips email" do
    user = User.new(email: " DOWNCASED@EXAMPLE.COM ", clerk_user_id: "test_123", subscription_plan: "free")
    user.save
    assert_equal("downcased@example.com", user.email)
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
