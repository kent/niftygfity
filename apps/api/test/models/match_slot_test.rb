require "test_helper"

class MatchSlotTest < ActiveSupport::TestCase
  test "belongs to match_arrangement" do
    slot = match_slots(:one)
    assert_equal match_arrangements(:one), slot.match_arrangement
  end

  test "belongs to person" do
    slot = match_slots(:one)
    assert_equal people(:mom), slot.person
  end

  test "can have optional gift" do
    slot = MatchSlot.new(
      match_arrangement: match_arrangements(:one),
      person: people(:sister),
      row_index: 5,
      gift: nil
    )
    assert slot.valid?
  end

  test "validates row_index is not negative" do
    slot = MatchSlot.new(
      match_arrangement: match_arrangements(:one),
      person: people(:sister),
      row_index: -1,
      gift: nil
    )
    assert_not slot.valid?
    assert slot.errors[:row_index].any?
  end

  test "validates uniqueness of person + row_index per arrangement" do
    existing = match_slots(:one)
    duplicate = MatchSlot.new(
      match_arrangement: existing.match_arrangement,
      person: existing.person,
      row_index: existing.row_index,
      gift: nil
    )
    assert_not duplicate.valid?
    assert duplicate.errors[:person_id].any?
  end
end
