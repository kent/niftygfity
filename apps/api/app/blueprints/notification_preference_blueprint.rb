class NotificationPreferenceBlueprint < ApplicationBlueprint
  fields :pending_gifts_reminder_enabled,
         :no_gifts_before_christmas_enabled,
         :no_gift_lists_december_enabled,
         :created_at,
         :updated_at
end
