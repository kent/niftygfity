require "test_helper"

class MatchArrangementTest < ActiveSupport::TestCase
  test "belongs to holiday" do
    arrangement = match_arrangements(:one)
    assert_equal holidays(:christmas), arrangement.holiday
  end

  test "has many match_slots" do
    arrangement = match_arrangements(:one)
    assert_equal 2, arrangement.match_slots.count
  end

  test "validates max 4 people" do
    arrangement = MatchArrangement.new(
      holiday: holidays(:christmas),
      person_ids: [ 1, 2, 3, 4, 5 ]
    )
    assert_not arrangement.valid?
    assert_includes arrangement.errors[:person_ids], "cannot exceed 4 people"
  end

  test "allows up to 4 people" do
    arrangement = MatchArrangement.new(
      holiday: holidays(:christmas),
      person_ids: [ 1, 2, 3, 4 ]
    )
    # Only checking person_ids validation
    arrangement.valid?
    assert_not arrangement.errors[:person_ids].any?
  end

  test "destroys slots when destroyed" do
    arrangement = match_arrangements(:one)
    slot_count = arrangement.match_slots.count

    assert_difference("MatchSlot.count", -slot_count) do
      arrangement.destroy
    end
  end
end
