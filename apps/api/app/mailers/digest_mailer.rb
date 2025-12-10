class DigestMailer < ApplicationMailer
  def daily_digest(user, changes_by_holiday)
    @user = user
    @changes_by_holiday = changes_by_holiday
    @total_changes = changes_by_holiday.values.flatten.count
    @frontend_url = ENV.fetch("FRONTEND_URL", "https://listygifty.com")

    mail(
      to: user.email,
      subject: "🎁 #{@total_changes} gift update#{'s' if @total_changes != 1} from your shared holidays"
    )
  end
end
