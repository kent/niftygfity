# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_12_12_000003) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "email_deliveries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "dedupe_key", null: false
    t.text "error"
    t.bigint "holiday_id"
    t.string "kind", null: false
    t.jsonb "metadata", default: {}
    t.datetime "sent_at", null: false
    t.string "status", default: "sent", null: false
    t.string "subject", null: false
    t.string "to_email", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["holiday_id"], name: "index_email_deliveries_on_holiday_id"
    t.index ["kind"], name: "index_email_deliveries_on_kind"
    t.index ["user_id", "kind", "dedupe_key"], name: "idx_email_deliveries_dedupe", unique: true
    t.index ["user_id", "kind", "sent_at"], name: "index_email_deliveries_on_user_id_and_kind_and_sent_at"
    t.index ["user_id"], name: "index_email_deliveries_on_user_id"
  end

  create_table "gift_changes", force: :cascade do |t|
    t.string "change_type", null: false
    t.jsonb "changes_data", default: {}
    t.datetime "created_at", null: false
    t.bigint "gift_id", null: false
    t.bigint "holiday_id", null: false
    t.datetime "notified_at"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["gift_id"], name: "index_gift_changes_on_gift_id"
    t.index ["holiday_id", "notified_at"], name: "index_gift_changes_on_holiday_id_and_notified_at"
    t.index ["holiday_id"], name: "index_gift_changes_on_holiday_id"
    t.index ["notified_at"], name: "index_gift_changes_on_notified_at"
    t.index ["user_id"], name: "index_gift_changes_on_user_id"
  end

  create_table "gift_givers", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "gift_id", null: false
    t.integer "person_id", null: false
    t.datetime "updated_at", null: false
    t.index ["gift_id"], name: "index_gift_givers_on_gift_id"
    t.index ["person_id"], name: "index_gift_givers_on_person_id"
  end

  create_table "gift_recipients", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "gift_id", null: false
    t.integer "person_id", null: false
    t.datetime "updated_at", null: false
    t.index ["gift_id"], name: "index_gift_recipients_on_gift_id"
    t.index ["person_id"], name: "index_gift_recipients_on_person_id"
  end

  create_table "gift_statuses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.integer "position"
    t.datetime "updated_at", null: false
  end

  create_table "gift_suggestions", force: :cascade do |t|
    t.string "approximate_price"
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "holiday_id"
    t.string "name"
    t.integer "person_id", null: false
    t.datetime "updated_at", null: false
    t.index ["holiday_id"], name: "index_gift_suggestions_on_holiday_id"
    t.index ["person_id"], name: "index_gift_suggestions_on_person_id"
  end

  create_table "gifts", force: :cascade do |t|
    t.decimal "cost", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.integer "created_by_user_id"
    t.text "description"
    t.integer "gift_status_id", null: false
    t.integer "holiday_id", null: false
    t.string "link"
    t.string "name"
    t.integer "position", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_user_id"], name: "index_gifts_on_created_by_user_id"
    t.index ["gift_status_id"], name: "index_gifts_on_gift_status_id"
    t.index ["holiday_id", "position"], name: "index_gifts_on_holiday_id_and_position"
    t.index ["holiday_id"], name: "index_gifts_on_holiday_id"
  end

  create_table "holiday_people", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "holiday_id", null: false
    t.bigint "person_id", null: false
    t.datetime "updated_at", null: false
    t.index ["holiday_id", "person_id"], name: "index_holiday_people_on_holiday_id_and_person_id", unique: true
    t.index ["holiday_id"], name: "index_holiday_people_on_holiday_id"
    t.index ["person_id"], name: "index_holiday_people_on_person_id"
  end

  create_table "holiday_users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "holiday_id", null: false
    t.string "role", default: "collaborator", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["holiday_id"], name: "index_holiday_users_on_holiday_id"
    t.index ["user_id"], name: "index_holiday_users_on_user_id"
  end

  create_table "holidays", force: :cascade do |t|
    t.boolean "archived", default: false, null: false
    t.boolean "completed", default: false, null: false
    t.datetime "created_at", null: false
    t.date "date"
    t.string "icon"
    t.boolean "is_template", default: false, null: false
    t.string "name"
    t.string "share_token"
    t.datetime "updated_at", null: false
    t.index ["share_token"], name: "index_holidays_on_share_token", unique: true
  end

  create_table "match_arrangements", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.jsonb "groupings", default: [], null: false
    t.bigint "holiday_id", null: false
    t.integer "person_ids", default: [], array: true
    t.string "title", default: "Gift Comparison"
    t.datetime "updated_at", null: false
    t.index ["holiday_id"], name: "index_match_arrangements_on_holiday_id"
  end

  create_table "match_slots", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "gift_id"
    t.string "group_key"
    t.bigint "match_arrangement_id", null: false
    t.bigint "person_id", null: false
    t.integer "row_index", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["gift_id"], name: "index_match_slots_on_gift_id"
    t.index ["match_arrangement_id", "person_id", "row_index"], name: "idx_match_slots_unique", unique: true
    t.index ["match_arrangement_id"], name: "index_match_slots_on_match_arrangement_id"
    t.index ["person_id"], name: "index_match_slots_on_person_id"
  end

  create_table "notification_preferences", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "no_gift_lists_december_enabled", default: true, null: false
    t.boolean "no_gifts_before_christmas_enabled", default: true, null: false
    t.boolean "pending_gifts_reminder_enabled", default: true, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_notification_preferences_on_user_id", unique: true
  end

  create_table "people", force: :cascade do |t|
    t.integer "age"
    t.datetime "created_at", null: false
    t.string "gender"
    t.string "name"
    t.string "relationship"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_people_on_user_id"
  end

  create_table "solid_queue_blocked_executions", force: :cascade do |t|
    t.string "concurrency_key", null: false
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.index ["concurrency_key", "priority", "job_id"], name: "index_solid_queue_blocked_executions_for_release"
    t.index ["expires_at", "concurrency_key"], name: "index_solid_queue_blocked_executions_for_maintenance"
    t.index ["job_id"], name: "index_solid_queue_blocked_executions_on_job_id", unique: true
  end

  create_table "solid_queue_claimed_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.bigint "process_id"
    t.index ["job_id"], name: "index_solid_queue_claimed_executions_on_job_id", unique: true
    t.index ["process_id", "job_id"], name: "index_solid_queue_claimed_executions_on_process_id_and_job_id"
  end

  create_table "solid_queue_failed_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "error"
    t.bigint "job_id", null: false
    t.index ["job_id"], name: "index_solid_queue_failed_executions_on_job_id", unique: true
  end

  create_table "solid_queue_jobs", force: :cascade do |t|
    t.string "active_job_id"
    t.text "arguments"
    t.string "class_name", null: false
    t.string "concurrency_key"
    t.datetime "created_at", null: false
    t.datetime "finished_at"
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.datetime "scheduled_at"
    t.datetime "updated_at", null: false
    t.index ["active_job_id"], name: "index_solid_queue_jobs_on_active_job_id"
    t.index ["class_name"], name: "index_solid_queue_jobs_on_class_name"
    t.index ["finished_at"], name: "index_solid_queue_jobs_on_finished_at"
    t.index ["queue_name", "finished_at"], name: "index_solid_queue_jobs_for_filtering"
    t.index ["scheduled_at", "finished_at"], name: "index_solid_queue_jobs_for_alerting"
  end

  create_table "solid_queue_pauses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "queue_name", null: false
    t.index ["queue_name"], name: "index_solid_queue_pauses_on_queue_name", unique: true
  end

  create_table "solid_queue_processes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "hostname"
    t.string "kind", null: false
    t.datetime "last_heartbeat_at", null: false
    t.text "metadata"
    t.string "name", null: false
    t.integer "pid", null: false
    t.bigint "supervisor_id"
    t.index ["last_heartbeat_at"], name: "index_solid_queue_processes_on_last_heartbeat_at"
    t.index ["name", "supervisor_id"], name: "index_solid_queue_processes_on_name_and_supervisor_id", unique: true
    t.index ["supervisor_id"], name: "index_solid_queue_processes_on_supervisor_id"
  end

  create_table "solid_queue_ready_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.index ["job_id"], name: "index_solid_queue_ready_executions_on_job_id", unique: true
    t.index ["priority", "job_id"], name: "index_solid_queue_poll_all"
    t.index ["queue_name", "priority", "job_id"], name: "index_solid_queue_poll_by_queue"
  end

  create_table "solid_queue_recurring_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.datetime "run_at", null: false
    t.string "task_key", null: false
    t.index ["job_id"], name: "index_solid_queue_recurring_executions_on_job_id", unique: true
    t.index ["task_key", "run_at"], name: "index_solid_queue_recurring_executions_on_task_key_and_run_at", unique: true
  end

  create_table "solid_queue_recurring_tasks", force: :cascade do |t|
    t.text "arguments"
    t.string "class_name"
    t.string "command", limit: 2048
    t.datetime "created_at", null: false
    t.text "description"
    t.string "key", null: false
    t.integer "priority", default: 0
    t.string "queue_name"
    t.string "schedule", null: false
    t.boolean "static", default: true, null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_solid_queue_recurring_tasks_on_key", unique: true
    t.index ["static"], name: "index_solid_queue_recurring_tasks_on_static"
  end

  create_table "solid_queue_scheduled_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.datetime "scheduled_at", null: false
    t.index ["job_id"], name: "index_solid_queue_scheduled_executions_on_job_id", unique: true
    t.index ["scheduled_at", "priority", "job_id"], name: "index_solid_queue_dispatch_all"
  end

  create_table "solid_queue_semaphores", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.string "key", null: false
    t.datetime "updated_at", null: false
    t.integer "value", default: 1, null: false
    t.index ["expires_at"], name: "index_solid_queue_semaphores_on_expires_at"
    t.index ["key", "value"], name: "index_solid_queue_semaphores_on_key_and_value"
    t.index ["key"], name: "index_solid_queue_semaphores_on_key", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "clerk_user_id", null: false
    t.datetime "created_at", null: false
    t.boolean "digest_enabled", default: true, null: false
    t.string "email", null: false
    t.string "email_preferences_token"
    t.string "first_name"
    t.string "image_url"
    t.datetime "last_digest_sent_at"
    t.string "last_name"
    t.string "phone"
    t.string "stripe_customer_id"
    t.datetime "subscription_expires_at"
    t.string "subscription_plan", default: "free", null: false
    t.datetime "updated_at", null: false
    t.string "username"
    t.datetime "welcomed_at"
    t.index ["clerk_user_id"], name: "index_users_on_clerk_user_id", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["email_preferences_token"], name: "index_users_on_email_preferences_token", unique: true
    t.index ["stripe_customer_id"], name: "index_users_on_stripe_customer_id", unique: true
  end

  add_foreign_key "email_deliveries", "holidays"
  add_foreign_key "email_deliveries", "users"
  add_foreign_key "gift_changes", "gifts"
  add_foreign_key "gift_changes", "holidays"
  add_foreign_key "gift_changes", "users"
  add_foreign_key "gift_givers", "gifts"
  add_foreign_key "gift_givers", "people"
  add_foreign_key "gift_recipients", "gifts"
  add_foreign_key "gift_recipients", "people"
  add_foreign_key "gift_suggestions", "holidays"
  add_foreign_key "gift_suggestions", "people"
  add_foreign_key "gifts", "gift_statuses"
  add_foreign_key "gifts", "holidays"
  add_foreign_key "gifts", "users", column: "created_by_user_id"
  add_foreign_key "holiday_people", "holidays"
  add_foreign_key "holiday_people", "people"
  add_foreign_key "holiday_users", "holidays"
  add_foreign_key "holiday_users", "users"
  add_foreign_key "match_arrangements", "holidays"
  add_foreign_key "match_slots", "gifts"
  add_foreign_key "match_slots", "match_arrangements"
  add_foreign_key "match_slots", "people"
  add_foreign_key "notification_preferences", "users"
  add_foreign_key "people", "users"
  add_foreign_key "solid_queue_blocked_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_claimed_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_failed_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_ready_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_recurring_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_scheduled_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
end
