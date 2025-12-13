class EmailDeliveryBlueprint < ApplicationBlueprint
  fields :kind, :subject, :sent_at, :status

  view :detailed do
    fields :to_email, :error, :metadata, :created_at
    association :holiday, blueprint: HolidayBlueprint
  end
end

