# Clerk authentication configuration for API-only apps
# See: https://clerk.com/docs/reference/ruby/rails
#
# IMPORTANT: This API uses manual JWT verification rather than Clerk's session middleware
# because we receive bearer tokens from a separate Next.js frontend.
#
# Required environment variables:
#   CLERK_SECRET_KEY   - Your Clerk secret key (from dashboard.clerk.com)
#   CLERK_SKIP_RAILTIE - Set to "1" to disable automatic middleware insertion
#
# The ApplicationController manually verifies JWT tokens from the Authorization header.

if ENV["CLERK_SECRET_KEY"].present?
  Clerk.configure do |config|
    config.secret_key = ENV["CLERK_SECRET_KEY"]
  end
elsif Rails.env.production?
  # Allow migrations and other db tasks to run without Clerk configured
  if defined?(Rake) && Rake.application.top_level_tasks.any? { |task| task.start_with?("db:") }
    # Skip Clerk configuration for database tasks
  else
    raise "CLERK_SECRET_KEY must be set in production!"
  end
end

