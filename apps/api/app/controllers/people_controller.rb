class PeopleController < ApplicationController
  before_action :set_person, only: %i[show update destroy]

  def index
    people = current_user.people
    render json: PersonBlueprint.render(people)
  end

  def show
    if params[:include] == "gifts"
      render json: PersonBlueprint.render(@person, view: :with_gifts)
    else
      render json: PersonBlueprint.render(@person)
    end
  end

  def create
    person = current_user.people.build(person_params)

    if person.save
      render json: PersonBlueprint.render(person), status: :created
    else
      render json: { errors: person.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @person.update(person_params)
      render json: PersonBlueprint.render(@person)
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
    @person = current_user.people.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Not found" }, status: :not_found
  end

  def person_params
    params.require(:person).permit(:name, :relationship, :age, :gender)
  end
end
