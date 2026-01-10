require "posthog-ruby"

POSTHOG = PostHog::Client.new({
  api_key: ENV.fetch("POSTHOG_API_KEY", "phc_hIOp1rNlP9w5VzpnUbDYqpvOrJsHXqNZJ5gv1f3nbZs"),
  host: "https://us.i.posthog.com",
  on_error: proc { |status, msg| Rails.logger.error("PostHog error: #{status} - #{msg}") }
})
