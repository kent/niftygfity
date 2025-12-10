class SendWelcomeEmailJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find_by(id: user_id)
    return unless user
    return if user.welcomed_at.present? # Already welcomed (e.g., via invite)

    user.update!(welcomed_at: Time.current)
    WelcomeMailer.welcome(user).deliver_later
  end
end
