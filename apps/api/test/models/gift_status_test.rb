require "test_helper"

class GiftStatusTest < ActiveSupport::TestCase
  test "requires name" do
    status = GiftStatus.new(position: 1)
    assert_not status.valid?
    assert_includes status.errors[:name], "can't be blank"
  end

  test "requires unique name" do
    GiftStatus.create!(name: "Unique Status", position: 99)
    duplicate = GiftStatus.new(name: "Unique Status", position: 100)
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:name], "has already been taken"
  end

  test "requires position" do
    status = GiftStatus.new(name: "Test Status")
    assert_not status.valid?
    assert_includes status.errors[:position], "can't be blank"
  end

  test "default scope orders by position" do
    statuses = GiftStatus.all.to_a
    assert_equal statuses, statuses.sort_by(&:position)
  end

  test "has many gifts" do
    status = gift_statuses(:idea)
    assert_includes status.gifts, gifts(:sweater)
  end
end
