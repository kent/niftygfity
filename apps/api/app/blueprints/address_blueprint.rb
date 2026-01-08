class AddressBlueprint < ApplicationBlueprint
  fields :label, :street_line_1, :street_line_2, :city, :state, :postal_code, :country, :is_default, :created_at, :updated_at

  field :formatted_address do |address|
    address.formatted_address
  end

  field :formatted_address_single_line do |address|
    address.formatted_address_single_line
  end
end
