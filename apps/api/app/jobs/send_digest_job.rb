class SendDigestJob < ApplicationJob
  queue_as :default

  def perform
    # Find all users who have digest enabled and are collaborators on shared holidays
    users_to_notify.each do |user|
      send_digest_to(user)
    end
  end

  private

  def users_to_notify
    User.where(digest_enabled: true)
        .joins(:holiday_users)
        .where(holiday_users: { role: %w[owner collaborator] })
        .distinct
  end

  def send_digest_to(user)
    # Get pending changes for holidays this user is a member of
    # Exclude changes made by this user themselves
    changes = GiftChange.pending
                        .includes(:gift, :holiday, :user)
                        .where(holiday_id: user.holiday_ids)
                        .where.not(user_id: user.id)
                        .order(created_at: :desc)

    return if changes.empty?

    # Group by holiday
    changes_by_holiday = changes.group_by(&:holiday)

    # Send the email
    DigestMailer.daily_digest(user, changes_by_holiday).deliver_now

    # Mark changes as notified and update user's last digest time
    GiftChange.mark_notified!(changes.pluck(:id))
    user.update_column(:last_digest_sent_at, Time.current)

    Rails.logger.info "[SendDigestJob] Sent digest to #{user.email} with #{changes.count} changes"
  rescue StandardError => e
    Rails.logger.error "[SendDigestJob] Failed to send digest to #{user.email}: #{e.message}"
  end
end
