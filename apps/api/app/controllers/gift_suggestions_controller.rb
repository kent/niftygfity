class GiftSuggestionsController < ApplicationController
  before_action :set_person, only: %i[index create refine]
  before_action :set_suggestion, only: %i[accept destroy]
  before_action :require_premium!, only: %i[create refine]

  def index
    suggestions = @person.gift_suggestions.includes(:holiday).order(created_at: :desc)
    render json: GiftSuggestionBlueprint.render(suggestions)
  end

  def create
    service = GiftSuggestionService.new(@person, current_user)
    suggestions = service.generate
    render json: GiftSuggestionBlueprint.render(suggestions), status: :created
  rescue => e
    render_error(e.message)
  end

  # POST /people/:person_id/gift_suggestions/refine
  # Refines selected suggestions for a specific holiday
  def refine
    holiday = current_user.holidays.find(params[:holiday_id])
    suggestion_ids = params[:suggestion_ids] || []

    if suggestion_ids.empty?
      return render_error("No suggestions selected", status: :bad_request)
    end

    service = GiftSuggestionService.new(@person, current_user)
    suggestions = service.refine_for_holiday(suggestion_ids, holiday)
    render json: GiftSuggestionBlueprint.render(suggestions), status: :created
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Holiday not found" }, status: :not_found
  rescue => e
    render_error(e.message)
  end

  def accept
    gift_status = GiftStatus.find_by(name: "Idea") || GiftStatus.first
    holiday = @suggestion.holiday || params[:holiday_id]&.then { |id| current_user.holidays.find(id) } || current_user.holidays.first

    gift = Gift.new(
      name: @suggestion.name,
      description: @suggestion.description,
      cost: parse_price(@suggestion.approximate_price),
      holiday: holiday,
      gift_status: gift_status
    )

    if gift.save
      gift.recipients << @suggestion.person
      @suggestion.destroy!
      render json: GiftBlueprint.render(gift), status: :created
    else
      render json: { errors: gift.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @suggestion.destroy!
    head :no_content
  end

  private

  def set_person
    @person = current_user.people.find(params[:person_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Person not found" }, status: :not_found
  end

  def set_suggestion
    @suggestion = GiftSuggestion.joins(:person)
                                .where(people: { user_id: current_user.id })
                                .find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Suggestion not found" }, status: :not_found
  end

  def require_premium!
    return if current_user.premium?

    render json: {
      error: "Premium required",
      message: "AI gift suggestions are a premium feature. Upgrade to unlock.",
      upgrade_required: true
    }, status: :forbidden
  end

  def parse_price(price_string)
    return nil unless price_string

    # Extract first number from strings like "$25" or "$50-75"
    match = price_string.match(/\$?(\d+)/)
    match ? match[1].to_d : nil
  end
end
