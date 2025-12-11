class HolidayBlueprint < ApplicationBlueprint
  fields :name, :date, :icon, :is_template, :completed, :archived, :created_at, :updated_at

  field :share_token do |holiday, options|
    # Only show share_token to owners
    current_user = options[:current_user]
    holiday.owner?(current_user) ? holiday.share_token : nil
  end

  field :is_owner do |holiday, options|
    current_user = options[:current_user]
    current_user ? holiday.owner?(current_user) : false
  end

  field :role do |holiday, options|
    current_user = options[:current_user]
    if current_user
      holiday_user = holiday.holiday_users.find_by(user: current_user)
      holiday_user&.role
    end
  end

  field :collaborator_count do |holiday|
    holiday.holiday_users.count
  end

  view :with_gifts do
    association :gifts, blueprint: GiftBlueprint
  end

  view :with_collaborators do
    association :holiday_users, blueprint: HolidayUserBlueprint, name: :collaborators
  end
end
