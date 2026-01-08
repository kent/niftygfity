class CompanyProfile < ApplicationRecord
  belongs_to :workspace
  has_many :addresses, dependent: :destroy

  validates :name, presence: true
  validates :workspace_id, uniqueness: true
  validate :workspace_must_be_business

  private

  def workspace_must_be_business
    return if workspace&.business?

    errors.add(:workspace, "must be a business workspace")
  end
end
