class ApplicationController < ActionController::API
  before_action :authenticate_clerk_user!

  private

  def authenticate_clerk_user!
    token = extract_bearer_token
    return render_unauthorized unless token

    payload = verify_clerk_token(token)
    return render_unauthorized unless payload

    clerk_user_id = payload["sub"]
    email_from_token = token_email(payload)

    # Auto-create local user record if they don't exist yet
    @current_user = User.find_or_create_by!(clerk_user_id: clerk_user_id) do |u|
      clerk_user = fetch_clerk_user(clerk_user_id)
      apply_clerk_data(u, clerk_user, clerk_user_id, token_email: email_from_token)
      u.subscription_plan = "free"
    end

    # Sync user data if missing or stale
    sync_clerk_user_data(@current_user, clerk_user_id, token_email: email_from_token)

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

  def fetch_clerk_user(clerk_user_id)
    return nil unless ENV["CLERK_SECRET_KEY"].present?
    Clerk::SDK.new.users.find(clerk_user_id)
  rescue StandardError => e
    Rails.logger.warn "Failed to fetch Clerk user: #{e.message}"
    nil
  end

  def clerk_user_email(clerk_user)
    return nil unless clerk_user
    clerk_user.email_addresses&.find { |e| e["id"] == clerk_user.primary_email_address_id }&.dig("email_address")
  end

  def clerk_user_phone(clerk_user)
    return nil unless clerk_user&.phone_numbers&.any?
    clerk_user.phone_numbers.find { |p| p["id"] == clerk_user.primary_phone_number_id }&.dig("phone_number")
  end

  def apply_clerk_data(user, clerk_user, clerk_user_id, token_email: nil)
    user.email = clerk_user_email(clerk_user) || token_email || "#{clerk_user_id}@clerk.user"
    user.first_name = clerk_user&.first_name
    user.last_name = clerk_user&.last_name
    user.image_url = clerk_user&.image_url
    user.phone = clerk_user_phone(clerk_user)
    user.username = clerk_user&.username
  end

  def sync_clerk_user_data(user, clerk_user_id, token_email: nil)
    # Sync if email is placeholder or profile data is missing
    needs_sync = user.email.end_with?("@clerk.user") || user.first_name.nil? || user.image_url.nil?
    return unless needs_sync

    updates = {}
    updates[:email] = token_email if user.email.end_with?("@clerk.user") && token_email.present?

    clerk_user = fetch_clerk_user(clerk_user_id)
    if clerk_user
      updates[:email] ||= clerk_user_email(clerk_user) if user.email.end_with?("@clerk.user") && clerk_user_email(clerk_user)
      updates[:first_name] = clerk_user.first_name if user.first_name.nil? && clerk_user.first_name.present?
      updates[:last_name] = clerk_user.last_name if user.last_name.nil? && clerk_user.last_name.present?
      updates[:image_url] = clerk_user.image_url if user.image_url.nil? && clerk_user.image_url.present?
      updates[:phone] = clerk_user_phone(clerk_user) if user.phone.nil? && clerk_user_phone(clerk_user)
      updates[:username] = clerk_user.username if user.username.nil? && clerk_user.username.present?
    end

    user.update!(updates) if updates.any?
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

  def token_email(payload)
    payload["email_address"] || payload["email"]
  end
end
