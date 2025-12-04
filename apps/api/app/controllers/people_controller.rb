class PeopleController < ApplicationController
  before_action :set_person, only: %i[show update destroy]
  before_action :require_owner_for_destroy, only: %i[destroy]

  # GET /people
  # GET /people?holiday_id=X (returns your people + people shared to holiday X)
  def index
    if params[:holiday_id].present?
      holiday = current_user.holidays.find_by(id: params[:holiday_id])
      return render json: { error: "Holiday not found" }, status: :not_found unless holiday

      # Your people + people shared to this holiday (from any collaborator)
      own_people = current_user.people
      shared_people = holiday.shared_people.where.not(user_id: current_user.id)
      people = Person.where(id: own_people.select(:id)).or(Person.where(id: shared_people.select(:id)))
      render json: PersonBlueprint.render(people, current_user: current_user)
    else
      people = current_user.people
      render json: PersonBlueprint.render(people, current_user: current_user)
    end
  end

  def show
    if params[:include] == "gifts"
      render json: PersonBlueprint.render(@person, view: :with_gifts, current_user: current_user)
    else
      render json: PersonBlueprint.render(@person, current_user: current_user)
    end
  end

  def create
    person = current_user.people.build(person_params)

    if person.save
      render json: PersonBlueprint.render(person, current_user: current_user), status: :created
    else
      render json: { errors: person.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @person.update(person_params)
      render json: PersonBlueprint.render(@person, current_user: current_user)
    else
      render json: { errors: @person.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @person.destroy!
    head :no_content
  end

  private

  def set_person
    # First try to find in own people
    @person = current_user.people.find_by(id: params[:id])
    return if @person

    # Then check if it's a shared person (accessible via shared holidays)
    @person = Person.find_by(id: params[:id])
    return render json: { error: "Not found" }, status: :not_found unless @person
    render json: { error: "Not found" }, status: :not_found unless @person.accessible_by?(current_user)
  end

  def require_owner_for_destroy
    return if @person.user_id == current_user.id
    render json: { error: "Only the owner can delete this person" }, status: :forbidden
  end

  def person_params
    params.require(:person).permit(:name, :relationship, :age, :gender)
  end
end
