require "test_helper"

class GiftTest < ActiveSupport::TestCase
  test "requires name" do
    gift = Gift.new(holiday: holidays(:christmas), gift_status: gift_statuses(:idea))
    assert_not gift.valid?
    assert_includes gift.errors[:name], "can't be blank"
  end

  test "belongs to holiday" do
    gift = gifts(:sweater)
    assert_equal holidays(:christmas), gift.holiday
  end

  test "belongs to gift_status" do
    gift = gifts(:sweater)
    assert_equal gift_statuses(:idea), gift.gift_status
  end

  test "has many recipients through gift_recipients" do
    gift = gifts(:sweater)
    assert_includes gift.recipients, people(:mom)
    assert_includes gift.recipients, people(:dad)
    assert_equal 2, gift.recipients.count
  end

  test "has many givers through gift_givers" do
    gift = gifts(:sweater)
    assert_includes gift.givers, people(:sister)
  end

  test "can have multiple recipients and givers" do
    gift = Gift.create!(
      name: "Family Vacation",
      holiday: holidays(:christmas),
      gift_status: gift_statuses(:idea),
      cost: 500.00
    )
    gift.recipients << [ people(:mom), people(:dad) ]
    gift.givers << [ people(:sister) ]

    assert_equal 2, gift.recipients.count
    assert_equal 1, gift.givers.count
  end
end
