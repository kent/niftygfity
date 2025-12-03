class BillingController < ApplicationController
  skip_before_action :authenticate_clerk_user!, only: [ :webhook, :charity_stats ]
  skip_before_action :verify_authenticity_token, only: [ :webhook ], raise: false

  PRICES = {
    yearly: { amount: 2500, currency: "cad", interval: "year", years: 1 },
    two_year: { amount: 4000, currency: "cad", interval: "year", years: 2 }
  }.freeze

  # GET /billing/status
  def status
    render json: {
      subscription_plan: current_user.subscription_plan,
      subscription_status: current_user.subscription_status,
      subscription_expires_at: current_user.subscription_expires_at,
      gift_count: current_user.gift_count,
      gifts_remaining: current_user.gifts_remaining,
      can_create_gift: current_user.can_create_gift?,
      free_limit: User::FREE_GIFT_LIMIT
    }
  end

  # GET /billing/charity_stats (public)
  def charity_stats
    # 10% of all proceeds go to charity
    total_revenue_cents = calculate_total_revenue
    charity_amount_cents = (total_revenue_cents * 0.10).to_i

    # Obfuscate the exact amount
    fuzzy_data = get_fuzzy_amount(charity_amount_cents)

    render json: {
      fuzzy_raised_amount: fuzzy_data[:amount],
      milestone_description: fuzzy_data[:milestone],
      charity_percentage: 10,
      currency: "CAD"
    }
  end

  # POST /billing/create_checkout_session
  def create_checkout_session
    plan = params[:plan]&.to_sym
    price_config = PRICES[plan]

    unless price_config
      return render json: { error: "Invalid plan" }, status: :unprocessable_entity
    end

    # Create or retrieve Stripe customer
    customer = find_or_create_stripe_customer

    session = Stripe::Checkout::Session.create(
      customer: customer.id,
      payment_method_types: [ "card" ],
      line_items: [ {
        price_data: {
          currency: price_config[:currency],
          product_data: {
            name: plan == :yearly ? "NiftyGifty Premium (1 Year)" : "NiftyGifty Premium (2 Years)",
            description: "Unlimited gift tracking • $0.068 CAD/day"
          },
          unit_amount: price_config[:amount]
        },
        quantity: 1
      } ],
      mode: "payment",
      success_url: "#{frontend_url}/billing?success=true&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "#{frontend_url}/billing?canceled=true",
      metadata: {
        user_id: current_user.id,
        plan: plan.to_s,
        years: price_config[:years]
      }
    )

    render json: { checkout_url: session.url, session_id: session.id }
  end

  # POST /billing/redeem_coupon (dev only)
  def redeem_coupon
    unless Rails.env.development?
      return render json: { error: "Coupons only available in development" }, status: :forbidden
    end

    code = params[:code]&.upcase

    case code
    when "HOHOHO"
      current_user.activate_premium!(expires_at: 1.year.from_now)
      render json: {
        success: true,
        message: "🎅 Ho Ho Ho! Merry Christmas! Premium unlocked!",
        animation: "christmas",
        subscription_expires_at: current_user.subscription_expires_at
      }
    else
      render json: { error: "Invalid coupon code" }, status: :unprocessable_entity
    end
  end

  # POST /billing/webhook
  def webhook
    payload = request.body.read
    sig_header = request.env["HTTP_STRIPE_SIGNATURE"]

    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, stripe_webhook_secret
      )
    rescue JSON::ParserError
      return head :bad_request
    rescue Stripe::SignatureVerificationError
      return head :bad_request
    end

    case event.type
    when "checkout.session.completed"
      handle_checkout_completed(event.data.object)
    end

    head :ok
  end

  private

  def find_or_create_stripe_customer
    if current_user.stripe_customer_id.present?
      Stripe::Customer.retrieve(current_user.stripe_customer_id)
    else
      customer = Stripe::Customer.create(
        email: current_user.email,
        metadata: { user_id: current_user.id }
      )
      current_user.update!(stripe_customer_id: customer.id)
      customer
    end
  end

  def handle_checkout_completed(session)
    user_id = session.metadata.user_id
    years = session.metadata.years.to_i
    user = User.find(user_id)

    # Calculate expiration from current expiration (if active) or now
    base_date = user.premium? ? user.subscription_expires_at : Time.current
    expires_at = base_date + years.years

    user.activate_premium!(expires_at: expires_at)
  end

  def frontend_url
    ENV.fetch("FRONTEND_URL", "http://localhost:3000")
  end

  def stripe_webhook_secret
    Rails.application.credentials.dig(:stripe, :webhook_secret) || ENV["STRIPE_WEBHOOK_SECRET"]
  end

  def calculate_total_revenue
    # Count premium users and estimate revenue
    # Each yearly = $25, each two_year = $40
    premium_count = User.where.not(subscription_expires_at: nil)
                        .where("subscription_expires_at > ?", Time.current)
                        .count
    # Estimate average of $30 per subscription
    # Add a base "starter" amount of $25,000 revenue (so $2,500 for charity)
    (premium_count * 3000) + 2_500_000
  end

  def format_currency(cents)
    dollars = cents / 100.0
    "$#{'%.2f' % dollars} CAD"
  end

  def get_fuzzy_amount(cents)
    dollars = cents / 100.0

    if dollars < 100
      { amount: "Over $0", milestone: "We're just getting started!" }
    elsif dollars < 500
      { amount: "Over $100", milestone: "We've passed the $100 mark!" }
    elsif dollars < 1000
      { amount: "Over $500", milestone: "Halfway to our first thousand!" }
    elsif dollars < 2000
      { amount: "Over $1,000", milestone: "We've raised over $1,000 for charity!" }
    elsif dollars < 3000
      { amount: "Over $2,000", milestone: "Two thousand dollars raised!" }
    elsif dollars < 5000
      { amount: "Over $3,000", milestone: "We're growing fast!" }
    elsif dollars < 10000
      { amount: "Over $5,000", milestone: "Five thousand dollars and counting!" }
    elsif dollars < 25000
      { amount: "Over $10,000", milestone: "Double digits! Over $10k raised!" }
    elsif dollars < 50000
      { amount: "Over $25,000", milestone: "Quarter of a million... wait, no, $25k!" }
    elsif dollars < 100000
      { amount: "Over $50,000", milestone: "Halfway to six figures!" }
    else
      # Round down to nearest 10k
      thousands = (dollars / 10000).floor * 10
      { amount: "Over $#{thousands},000", milestone: "We're making a huge impact!" }
    end
  end
end
