class WelcomeMailer < ApplicationMailer
  def welcome(user)
    @user = user
    @frontend_url = ENV.fetch("FRONTEND_URL", "https://listygifty.com")

    mail(
      to: user.email,
      subject: "🎁 Welcome to Listy Gifty!"
    )
  end

  def welcome_from_invite(user, holiday)
    @user = user
    @holiday = holiday
    @frontend_url = ENV.fetch("FRONTEND_URL", "https://listygifty.com")

    mail(
      to: user.email,
      subject: "🎁 Welcome to Listy Gifty! You've joined #{holiday.name}"
    )
  end
end
