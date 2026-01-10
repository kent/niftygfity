class HealthController < ApplicationController
  skip_before_action :authenticate!

  def show
    if database_connected?
      render json: { status: "ok" }
    else
      render json: { status: "error" }, status: :service_unavailable
    end
  rescue StandardError
    render json: { status: "error" }, status: :service_unavailable
  end

  private

  def database_connected?
    ActiveRecord::Base.connection.execute("SELECT 1")
    true
  rescue StandardError
    false
  end
end
