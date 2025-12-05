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

ActiveRecord::Schema[8.1].define(version: 2025_12_04_164129) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

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

  create_table "users", force: :cascade do |t|
    t.string "clerk_user_id", null: false
    t.datetime "created_at", null: false
    t.boolean "digest_enabled", default: true, null: false
    t.string "email", null: false
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
    t.index ["clerk_user_id"], name: "index_users_on_clerk_user_id", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["stripe_customer_id"], name: "index_users_on_stripe_customer_id", unique: true
  end

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
  add_foreign_key "people", "users"
end
