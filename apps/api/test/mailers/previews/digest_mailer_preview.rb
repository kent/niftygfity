class DigestMailerPreview < ActionMailer::Preview
  def daily_digest
    user = User.first || User.new(
      email: "demo@example.com",
      first_name: "Alex"
    )

    # Create mock data for preview
    holiday = Holiday.first || Holiday.new(
      name: "Christmas 2025",
      date: Date.new(2025, 12, 25),
      icon: "🎄"
    )

    # Mock change objects
    changes = [
      OpenStruct.new(
        gift: OpenStruct.new(
          name: "Nintendo Switch",
          recipients: [OpenStruct.new(name: "Mom")],
          givers: [OpenStruct.new(name: "Dad")]
        ),
        created?: true,
        updated?: false,
        changes_data: {},
        user: user
      ),
      OpenStruct.new(
        gift: OpenStruct.new(
          name: "Cozy Blanket",
          recipients: [OpenStruct.new(name: "Sister")],
          givers: []
        ),
        created?: false,
        updated?: true,
        changes_data: { "price" => ["$30", "$45"], "notes" => ["", "Gift wrapped"] },
        user: user
      )
    ]

    changes_by_holiday = { holiday => changes }
    DigestMailer.daily_digest(user, changes_by_holiday)
  end
end
