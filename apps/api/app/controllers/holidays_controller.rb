class HolidaysController < ApplicationController
  skip_before_action :authenticate_clerk_user!, only: [ :templates ]
  before_action :set_holiday, only: %i[show update destroy share collaborators remove_collaborator leave]
  before_action :require_owner, only: %i[destroy remove_collaborator]

  def index
    holidays = current_user.holidays.user_holidays
    render json: HolidayBlueprint.render(holidays, current_user: current_user)
  end

  def templates
    holidays = Holiday.templates
    render json: HolidayBlueprint.render(holidays)
  end

  def show
    render json: HolidayBlueprint.render(@holiday, current_user: current_user)
  end

  def create
    holiday = Holiday.new(holiday_params)

    if holiday.save
      holiday.holiday_users.create!(user: current_user, role: "owner")
      render json: HolidayBlueprint.render(holiday, current_user: current_user), status: :created
    else
      render json: { errors: holiday.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @holiday.update(holiday_params)
      render json: HolidayBlueprint.render(@holiday, current_user: current_user)
    else
      render json: { errors: @holiday.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @holiday.destroy!
    head :no_content
  end

  # GET/POST /holidays/:id/share
  def share
    @holiday.regenerate_share_token! if request.post? || @holiday.share_token.blank?
    render json: { share_token: @holiday.share_token, share_url: share_url(@holiday.share_token) }
  end

  # POST /holidays/join
  def join
    token = params[:share_token]
    holiday = Holiday.find_by(share_token: token)

    return render json: { error: "Invalid share link" }, status: :not_found unless holiday
    return render json: { error: "You are already a member of this holiday" }, status: :unprocessable_entity if holiday.member?(current_user)

    holiday.holiday_users.create!(user: current_user, role: "collaborator")
    render json: HolidayBlueprint.render(holiday, current_user: current_user), status: :created
  end

  # DELETE /holidays/:id/leave
  def leave
    return render json: { error: "Owner cannot leave the holiday" }, status: :unprocessable_entity if @holiday.owner?(current_user)

    holiday_user = @holiday.holiday_users.find_by(user: current_user)
    holiday_user&.destroy!
    head :no_content
  end

  # GET /holidays/:id/collaborators
  def collaborators
    users = @holiday.holiday_users.includes(:user)
    render json: users.map { |hu|
      user = hu.user
      {
        user_id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        image_url: user.image_url,
        role: hu.role
      }
    }
  end

  # DELETE /holidays/:id/collaborators/:user_id
  def remove_collaborator
    user_to_remove = User.find(params[:user_id])
    return render json: { error: "Cannot remove the owner" }, status: :unprocessable_entity if @holiday.owner?(user_to_remove)

    holiday_user = @holiday.holiday_users.find_by(user: user_to_remove)
    return render json: { error: "User is not a collaborator" }, status: :not_found unless holiday_user

    holiday_user.destroy!
    head :no_content
  end

  private

  def set_holiday
    @holiday = current_user.holidays.find(params[:id])
  end

  def require_owner
    return if @holiday.owner?(current_user)
    render json: { error: "Only the owner can perform this action" }, status: :forbidden
  end

  def holiday_params
    params.require(:holiday).permit(:name, :date, :icon, :completed)
  end

  def share_url(token)
    # Frontend URL for joining - will be configured via env var
    base_url = ENV.fetch("FRONTEND_URL", "http://localhost:3000")
    "#{base_url}/join/#{token}"
  end
end
