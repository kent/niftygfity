module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      # For WebSocket connections, token is passed as a query parameter
      token = request.params[:token]
      return reject_unauthorized_connection unless token

      payload = verify_clerk_token(token)
      return reject_unauthorized_connection unless payload

      User.find_by(clerk_user_id: payload["sub"]) || reject_unauthorized_connection
    end

    def verify_clerk_token(token)
      return nil unless ENV["CLERK_SECRET_KEY"].present?
      Clerk::SDK.new.verify_token(token)
    rescue StandardError => e
      Rails.logger.warn "ActionCable auth failed: #{e.message}"
      nil
    end
  end
end
