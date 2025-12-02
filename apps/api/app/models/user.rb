class User < ApplicationRecord
  FREE_GIFT_LIMIT = 10
  SUBSCRIPTION_PLANS = %w[free premium].freeze

  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_many :sessions, dependent: :destroy
  has_many :people, dependent: :destroy
  has_many :holiday_users, dependent: :destroy
  has_many :holidays, through: :holiday_users

  validates :subscription_plan, inclusion: { in: SUBSCRIPTION_PLANS }

  def jwt_payload
    { "sub" => id, "email" => email }
  end

  # Gift counting - counts all gifts across user's holidays
  def gift_count
    Gift.joins(:holiday).where(holidays: { id: holiday_ids }).count
  end

  def gifts_remaining
    return nil if premium? # Unlimited
    [ FREE_GIFT_LIMIT - gift_count, 0 ].max
  end

  # Subscription status
  def premium?
    subscription_plan == "premium" && subscription_active?
  end

  def subscription_active?
    return true if subscription_plan == "free"
    subscription_expires_at.present? && subscription_expires_at > Time.current
  end

  def can_create_gift?
    premium? || gift_count < FREE_GIFT_LIMIT
  end

  # Subscription management
  def activate_premium!(expires_at:)
    update!(subscription_plan: "premium", subscription_expires_at: expires_at)
  end

  def cancel_premium!
    # Don't remove immediately - let it expire
    # Just mark that it won't renew (could add a field for this)
  end

  def subscription_status
    if premium?
      :active
    elsif subscription_plan == "premium" && !subscription_active?
      :expired
    else
      :free
    end
  end
end
