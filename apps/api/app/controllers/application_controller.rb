class ApplicationController < ActionController::API
  before_action :authenticate_clerk_user!

  private

  def authenticate_clerk_user!
    token = extract_bearer_token
    return render_unauthorized unless token

    payload = verify_clerk_token(token)
    return render_unauthorized unless payload

    clerk_user_id = payload["sub"]

    # Auto-create local user record if they don't exist yet
    @current_user = User.find_or_create_by!(clerk_user_id: clerk_user_id) do |u|
      u.email = fetch_clerk_email(clerk_user_id) || "#{clerk_user_id}@clerk.user"
      u.subscription_plan = "free"
    end

    # Update email if it's a placeholder
    if @current_user.email.end_with?("@clerk.user")
      real_email = fetch_clerk_email(clerk_user_id)
      @current_user.update!(email: real_email) if real_email
    end

    Current.user = @current_user
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error "Failed to create user: #{e.message}"
    render_unauthorized
  end

  def extract_bearer_token
    auth_header = request.headers["Authorization"]
    return nil unless auth_header&.start_with?("Bearer ")
    auth_header.split(" ", 2).last
  end

  def verify_clerk_token(token)
    return nil unless ENV["CLERK_SECRET_KEY"].present?

    # Use Clerk SDK to verify the JWT token
    Clerk::SDK.new.verify_token(token)
  rescue Clerk::AuthenticationError => e
    Rails.logger.warn "Clerk token verification failed: #{e.message}"
    nil
  rescue StandardError => e
    Rails.logger.error "Unexpected auth error: #{e.class} - #{e.message}"
    nil
  end

  def fetch_clerk_email(clerk_user_id)
    return nil unless ENV["CLERK_SECRET_KEY"].present?

    clerk_user = Clerk::SDK.new.users.find(clerk_user_id)
    clerk_user&.email_addresses&.find { |e| e["id"] == clerk_user.primary_email_address_id }&.dig("email_address")
  rescue StandardError => e
    Rails.logger.warn "Failed to fetch Clerk user email: #{e.message}"
    nil
  end

  def current_user
    @current_user
  end

  def render_unauthorized
    render json: { error: "Unauthorized" }, status: :unauthorized
  end

  def render_error(message, status: :unprocessable_entity)
    render json: { error: message }, status: status
  end
end
