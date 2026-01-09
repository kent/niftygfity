class MatchArrangementsController < ApplicationController
  before_action :set_match_arrangement, only: %i[show update destroy]

  # GET /match_arrangements
  def index
    arrangements = MatchArrangement.joins(:holiday)
                                   .where(holidays: { id: current_user.holiday_ids })
                                   .includes(:match_slots)
    render json: MatchArrangementBlueprint.render(arrangements)
  end

  # GET /match_arrangements/:id
  def show
    render json: MatchArrangementBlueprint.render(@match_arrangement)
  end

  # POST /match_arrangements
  def create
    arrangement = MatchArrangement.new(arrangement_params)

    unless current_user.holiday_ids.include?(arrangement.holiday_id)
      return render json: { error: "Holiday not found" }, status: :not_found
    end

    if arrangement.save
      render json: MatchArrangementBlueprint.render(arrangement), status: :created
    else
      render json: { errors: arrangement.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /match_arrangements/:id
  def update
    permitted = arrangement_params
    MatchArrangement.transaction do
      @match_arrangement.update!(permitted.except(:slots))

      if permitted[:slots].present?
        sync_slots(permitted[:slots])
      end
    end

    @match_arrangement.reload
    render json: MatchArrangementBlueprint.render(@match_arrangement)
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  # DELETE /match_arrangements/:id
  def destroy
    @match_arrangement.destroy!
    head :no_content
  end

  # GET /holidays/:holiday_id/match_arrangements
  def by_holiday
    holiday_id = params[:holiday_id].to_i
    unless current_user.holiday_ids.include?(holiday_id)
      return render json: { error: "Holiday not found" }, status: :not_found
    end

    arrangements = MatchArrangement.where(holiday_id: holiday_id).includes(:match_slots)
    render json: MatchArrangementBlueprint.render(arrangements)
  end

  private

  def set_match_arrangement
    @match_arrangement = MatchArrangement.joins(:holiday)
                                         .where(holidays: { id: current_user.holiday_ids })
                                         .includes(:match_slots)
                                         .find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Match arrangement not found" }, status: :not_found
  end

  def arrangement_params
    params.require(:match_arrangement).permit(
      :holiday_id,
      :title,
      person_ids: [],
      groupings: [ :id, :label, :person_id, { gift_ids: [] } ],
      slots: [ :id, :person_id, :gift_id, :group_key, :row_index ]
    )
  end

  def sync_slots(slots_data)
    existing_ids = @match_arrangement.match_slots.pluck(:id)
    incoming_ids = slots_data.filter_map { |s| s["id"] || s[:id] }

    # Delete removed slots
    @match_arrangement.match_slots.where.not(id: incoming_ids).destroy_all

    # Upsert slots - handle both string and symbol keys from JSON
    slots_data.each do |slot_data|
      slot_id = slot_data["id"] || slot_data[:id]
      person_id = slot_data["person_id"] || slot_data[:person_id]
      gift_id = slot_data["gift_id"] || slot_data[:gift_id]
      group_key = slot_data["group_key"] || slot_data[:group_key]
      row_index = slot_data["row_index"] || slot_data[:row_index]

      if slot_id.present? && existing_ids.include?(slot_id.to_i)
        slot = @match_arrangement.match_slots.find(slot_id)
        slot.update!(person_id:, gift_id:, group_key:, row_index:)
      else
        @match_arrangement.match_slots.create!(person_id:, gift_id:, group_key:, row_index:)
      end
    end
  end
end
