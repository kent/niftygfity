# frozen_string_literal: true

require "csv"

class ExportService
  GIFT_HEADERS = ["Name", "Description", "Cost", "Status", "Recipients", "Givers", "Link"].freeze
  PEOPLE_HEADERS = ["Name", "Email", "Relationship", "Age", "Gender", "Notes"].freeze

  def self.gifts_to_csv(holiday)
    gifts = holiday.gifts.includes(:gift_status, :recipients, :givers)

    CSV.generate do |csv|
      csv << GIFT_HEADERS

      gifts.each do |gift|
        csv << [
          gift.name,
          gift.description,
          gift.cost&.to_f,
          gift.gift_status&.name,
          gift.recipients.map(&:name).join(", "),
          gift.givers.map(&:name).join(", "),
          gift.link
        ]
      end
    end
  end

  def self.people_to_csv(workspace)
    people = workspace.people.order(:name)

    CSV.generate do |csv|
      csv << PEOPLE_HEADERS

      people.each do |person|
        csv << [
          person.name,
          person.email,
          person.relationship,
          person.age,
          person.gender,
          person.notes
        ]
      end
    end
  end
end
