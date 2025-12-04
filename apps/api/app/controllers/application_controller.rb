class ApplicationController < ActionController::API
  before_action :authenticate_clerk_user!

  private

  def authenticate_clerk_user!
    token = extract_bearer_token
    return render_unauthorized unless token

    payload = verify_clerk_token(token)
    return render_unauthorized unless payload

    # Auto-create local user record if they don't exist yet
    @current_user = User.find_or_create_by!(clerk_user_id: payload["sub"]) do |u|
      # Extract email from JWT claims or generate placeholder
      u.email = extract_email_from_payload(payload)
      u.subscription_plan = "free"
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

  def extract_email_from_payload(payload)
    # Clerk JWT may have email in different locations depending on configuration
    payload["email"] ||
      payload.dig("user", "email") ||
      payload.dig("user", "primary_email_address") ||
      "#{payload['sub']}@clerk.user"
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
