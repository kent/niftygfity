ENV["RAILS_ENV"] ||= "test"
# Skip Clerk middleware in tests - we mock token verification
ENV["CLERK_SKIP_RAILTIE"] ||= "1"
# Set dummy Clerk secret key for tests to avoid ConfigurationError
ENV["CLERK_SECRET_KEY"] ||= "sk_test_dummy_key_for_testing"

require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    parallelize(workers: :number_of_processors)
    fixtures :all
  end
end

module ActionDispatch
  class IntegrationTest
    def json_response
      JSON.parse(response.body)
    end

    def auth_headers_for(user)
      # Store the expected payload for this user
      token = "valid_token_#{user.id}"
      mock_clerk_token(token, { "sub" => user.clerk_user_id, "email" => user.email })
      { "Authorization" => "Bearer #{token}", "Content-Type" => "application/json" }
    end

    def mock_clerk_token(token, payload)
      # Mock Clerk::SDK instance verify_token method
      Clerk::SDK.class_eval do
        @@test_tokens ||= {}
        @@test_tokens[token] = payload

        define_method(:verify_token) do |t|
          if @@test_tokens[t]
            @@test_tokens[t]
          else
            raise Clerk::AuthenticationError, "Invalid token"
          end
        end
      end
    end

    def create_test_user(email: "test@example.com", clerk_id: "user_test_123")
      User.create!(
        email: email,
        clerk_user_id: clerk_id,
        subscription_plan: "free"
      )
    end
  end
end
