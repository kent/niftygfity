class PeopleController < ApplicationController
  before_action :set_person, only: %i[show update destroy]
  before_action :require_owner_for_destroy, only: %i[destroy]

  # GET /people
  # GET /people?holiday_id=X (returns your people + people shared to holiday X)
  # Without holiday_id: returns all accessible people (owned + shared via any holiday)
  def index
    if params[:holiday_id].present?
      holiday = current_user.holidays.find_by(id: params[:holiday_id])
      return render json: { error: "Holiday not found" }, status: :not_found unless holiday

      # Your people + people shared to this holiday (from any collaborator)
      people = accessible_people_for_holiday(holiday)
      render json: PersonBlueprint.render(people, current_user: current_user)
    else
      # All accessible people: owned + shared via any holiday user is member of
      people = all_accessible_people
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
    if @person.gifts_received.exists? || @person.gifts_given.exists?
      return render json: { error: "Cannot delete a person who has gifts attached" }, status: :unprocessable_entity
    end
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

  def accessible_people_for_holiday(holiday)
    own_people = current_user.people
    shared_people = holiday.shared_people.where.not(user_id: current_user.id)
    Person.where(id: own_people.select(:id)).or(Person.where(id: shared_people.select(:id)))
  end

  def all_accessible_people
    own_people_ids = current_user.people.select(:id)
    # People shared to any holiday the user is a member of
    shared_people_ids = Person.joins(:shared_holidays)
                              .where(holidays: { id: current_user.holiday_ids })
                              .where.not(user_id: current_user.id)
                              .select(:id)
    Person.where(id: own_people_ids).or(Person.where(id: shared_people_ids))
  end
end
