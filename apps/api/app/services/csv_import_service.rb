# frozen_string_literal: true

require "csv"

class CsvImportService
  VALID_HEADERS = %w[name email relationship age gender notes].freeze
  REQUIRED_HEADERS = %w[name].freeze

  def self.import_people(file:, workspace:, created_by:)
    new(file: file, workspace: workspace, created_by: created_by).import
  end

  def initialize(file:, workspace:, created_by:)
    @file = file
    @workspace = workspace
    @created_by = created_by
    @created = []
    @skipped = 0
    @errors = []
  end

  def import
    csv_content = @file.respond_to?(:read) ? @file.read : @file.tempfile.read
    csv = CSV.parse(csv_content, headers: true, header_converters: :downcase)

    validate_headers!(csv.headers)
    return error_result if @errors.any?

    csv.each_with_index do |row, index|
      process_row(row, index)
    end

    {
      created: @created.count,
      skipped: @skipped,
      errors: @errors,
      people: @created
    }
  rescue CSV::MalformedCSVError => e
    @errors << "Invalid CSV format: #{e.message}"
    error_result
  end

  private

  def validate_headers!(headers)
    headers = headers.compact.map(&:strip)

    missing = REQUIRED_HEADERS - headers
    if missing.any?
      @errors << "Missing required columns: #{missing.join(', ')}"
    end

    unknown = headers - VALID_HEADERS
    if unknown.any?
      @errors << "Unknown columns will be ignored: #{unknown.join(', ')}"
    end
  end

  def process_row(row, index)
    name = row["name"]&.strip
    email = row["email"]&.strip&.downcase

    if name.blank?
      @errors << "Row #{index + 2}: Name is required"
      return
    end

    if email.present? && @workspace.people.exists?(email: email)
      @skipped += 1
      return
    end

    person = @workspace.people.build(
      name: name,
      email: email.presence,
      relationship: row["relationship"]&.strip.presence,
      age: parse_age(row["age"]),
      gender: row["gender"]&.strip.presence,
      notes: row["notes"]&.strip.presence,
      user: @created_by
    )

    if person.save
      @created << person
    else
      @errors << "Row #{index + 2}: #{person.errors.full_messages.join(', ')}"
    end
  end

  def parse_age(value)
    return nil if value.blank?
    Integer(value.to_s.strip)
  rescue ArgumentError
    nil
  end

  def error_result
    {
      created: 0,
      skipped: 0,
      errors: @errors,
      people: []
    }
  end
end
