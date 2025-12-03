class HolidaysController < ApplicationController
  skip_before_action :authenticate_clerk_user!, only: [ :templates ]
  before_action :set_holiday, only: %i[show update destroy]

  def index
    holidays = current_user.holidays.user_holidays
    render json: HolidayBlueprint.render(holidays)
  end

  def templates
    holidays = Holiday.templates
    render json: HolidayBlueprint.render(holidays)
  end

  def show
    render json: HolidayBlueprint.render(@holiday)
  end

  def create
    holiday = Holiday.new(holiday_params)

    if holiday.save
      holiday.users << current_user
      render json: HolidayBlueprint.render(@holiday = holiday), status: :created
    else
      render json: { errors: holiday.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @holiday.update(holiday_params)
      render json: HolidayBlueprint.render(@holiday)
    else
      render json: { errors: @holiday.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @holiday.destroy!
    head :no_content
  end

  private

  def set_holiday
    @holiday = current_user.holidays.find(params[:id])
  end

  def holiday_params
    params.require(:holiday).permit(:name, :date, :icon, :completed)
  end
end
