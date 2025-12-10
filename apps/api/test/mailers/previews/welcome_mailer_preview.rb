class WelcomeMailerPreview < ActionMailer::Preview
  def welcome
    user = User.first || User.new(
      email: "demo@example.com",
      first_name: "Alex",
      last_name: "Smith"
    )
    WelcomeMailer.welcome(user)
  end

  def welcome_from_invite
    user = User.first || User.new(
      email: "demo@example.com",
      first_name: "Alex",
      last_name: "Smith"
    )
    holiday = Holiday.first || Holiday.new(
      name: "Christmas 2025",
      date: Date.new(2025, 12, 25),
      icon: "🎄"
    )
    WelcomeMailer.welcome_from_invite(user, holiday)
  end
end
