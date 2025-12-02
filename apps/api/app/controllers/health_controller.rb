class HealthController < ApplicationController
  skip_before_action :authenticate_user!

  def show
    db = database_status

    if db[:connected]
      render json: {
        status: "healthy",
        timestamp: Time.current.iso8601,
        version: "1.0.0",
        environment: Rails.env,
        database: db,
        ruby: RUBY_VERSION,
        rails: Rails.version
      }
    else
      render json: {
        status: "unhealthy",
        timestamp: Time.current.iso8601,
        database: db
      }, status: :service_unavailable
    end
  rescue StandardError => e
    render json: { status: "unhealthy", error: e.message }, status: :service_unavailable
  end

  private

  def database_status
    ActiveRecord::Base.connection.execute("SELECT 1")
    { connected: true, adapter: ActiveRecord::Base.connection.adapter_name }
  rescue StandardError => e
    { connected: false, error: e.message }
  end
end
