ENV["RAILS_ENV"] ||= "test"
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
    include Devise::Test::IntegrationHelpers

    def json_response
      JSON.parse(response.body)
    end

    def auth_headers_for(user)
      post user_session_path, params: { user: { email: user.email, password: "password123" } }, as: :json
      { "Authorization" => response.headers["Authorization"], "Content-Type" => "application/json" }
    end

    def create_test_user(email: "test@example.com", password: "password123")
      User.create!(email: email, password: password, password_confirmation: password, jti: SecureRandom.uuid)
    end
  end
end
