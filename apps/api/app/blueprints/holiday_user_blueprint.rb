class HolidayUserBlueprint < ApplicationBlueprint
  field :user_id do |holiday_user|
    holiday_user.user_id
  end

  field :email do |holiday_user|
    holiday_user.user.email
  end

  field :role do |holiday_user|
    holiday_user.role
  end
end
