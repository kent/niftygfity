module ApiKeyAuthenticatable
  extend ActiveSupport::Concern

  private

  def authenticate_api_key!
    raw_key = extract_api_key
    return render_unauthorized("API key required") unless raw_key

    @api_key = ApiKey.find_by_raw_key(raw_key)
    return render_unauthorized("Invalid or expired API key") unless @api_key

    @current_user = @api_key.user
    Current.user = @current_user
  end

  def extract_api_key
    # Support both Authorization: Bearer ng_xxx and X-API-Key: ng_xxx headers
    auth_header = request.headers["Authorization"]
    if auth_header&.start_with?("Bearer ng_")
      return auth_header.split(" ", 2).last
    end

    api_key_header = request.headers["X-API-Key"]
    if api_key_header&.start_with?("ng_")
      return api_key_header
    end

    nil
  end

  def api_key_request?
    auth_header = request.headers["Authorization"]
    api_key_header = request.headers["X-API-Key"]

    auth_header&.start_with?("Bearer ng_") || api_key_header&.start_with?("ng_")
  end

  def require_scope(scope)
    unless @api_key&.can?(scope)
      render json: { error: "Insufficient permissions. Required scope: #{scope}" }, status: :forbidden
    end
  end

  def require_read_scope
    require_scope(:read)
  end

  def require_write_scope
    require_scope(:write)
  end

  def require_admin_scope
    require_scope(:admin)
  end
end
