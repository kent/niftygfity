# Christmas 2025 Gift List Seed
# Run with: bin/rails runner db/seeds/christmas_2025.rb

puts "Seeding Christmas 2025 gift list..."

# Find user (first user in dev, or specify email)
user = User.first!
puts "Using user: #{user.email}"

# Clean up existing Christmas 2025 data
existing_holiday = Holiday.find_by(name: "Christmas 2025", is_template: false)
if existing_holiday
  puts "Removing existing Christmas 2025 data..."
  # Delete in FK order
  gift_ids = Gift.where(holiday: existing_holiday).pluck(:id)
  MatchSlot.where(gift_id: gift_ids).delete_all
  MatchArrangement.where(holiday: existing_holiday).delete_all
  GiftGiver.where(gift_id: gift_ids).delete_all
  GiftRecipient.where(gift_id: gift_ids).delete_all
  GiftChange.where(gift_id: gift_ids).delete_all
  Gift.where(id: gift_ids).delete_all
  HolidayPerson.where(holiday: existing_holiday).delete_all
  HolidayUser.where(holiday: existing_holiday).delete_all
  existing_holiday.destroy!
end

# Clean up orphaned people created by previous seed (no gifts attached)
puts "Cleaning up orphaned people..."
used_person_ids = (GiftRecipient.pluck(:person_id) + GiftGiver.pluck(:person_id)).uniq
Person.where(user: user).where.not(id: used_person_ids).destroy_all

# Ensure gift statuses exist
statuses = {}
[
  { name: "Idea", position: 1 },
  { name: "Purchased", position: 2 },
  { name: "In Transit", position: 3 },
  { name: "Delivered", position: 4 },
  { name: "Wrapped", position: 5 },
  { name: "Done", position: 6 }
].each do |attrs|
  statuses[attrs[:name]] = GiftStatus.find_or_create_by!(name: attrs[:name]) do |s|
    s.position = attrs[:position]
  end
end

# Create Christmas 2025 holiday
holiday = Holiday.create!(
  name: "Christmas 2025",
  date: Date.new(2025, 12, 25),
  icon: "gift",
  is_template: false
)

HolidayUser.create!(holiday: holiday, user: user, role: "owner")

# Normalized people names (individual people only)
PEOPLE = %w[
  Jack Emma Mom Dad Santa Stocking Christina Kent
  Nana Nonno Grandma Grandpa Rob Dave Heather Josh
  Ruby Pearl Frankie Leo Grace James Fenwicks
]

people = {}
PEOPLE.each do |name|
  people[name.downcase] = Person.find_or_create_by!(name: name, user: user)
end

# Link people to holiday
people.each_value do |person|
  HolidayPerson.find_or_create_by!(holiday: holiday, person: person)
end

# Helper to find person
def find_person(people, name)
  return nil if name.blank?
  people[name.strip.downcase]
end

# Helper to parse multiple people from a string
# "Mom and Dad" -> [Mom, Dad]
# "Jack & Emma" -> [Jack, Emma]
# "Christina, Kent, Jack Emma" -> [Christina, Kent, Jack, Emma]
def parse_people(people, str)
  return [] if str.blank?
  
  # Normalize separators
  normalized = str.gsub(/\s+and\s+/i, ", ")
                  .gsub(/\s*&\s*/, ", ")
                  .gsub(/\s+/, " ")
  
  normalized.split(",").map(&:strip).flat_map do |part|
    # Handle "Jack Emma" (space separated names)
    part.split(/\s+/)
  end.compact_blank.filter_map do |name|
    find_person(people, name)
  end.uniq
end

# Helper to parse cost
def parse_cost(cost)
  return nil if cost.nil?
  cost.is_a?(Numeric) ? cost : cost.to_s.gsub(/[$,]/, "").to_f
end

# Helper to map status
def map_status(statuses, status_str)
  return statuses["Idea"] if status_str.blank?
  
  case status_str.strip.downcase
  when "delivered" then statuses["Delivered"]
  when "idea" then statuses["Idea"]
  when "wrapped" then statuses["Wrapped"]
  when "in transit" then statuses["In Transit"]
  when "purchased" then statuses["Purchased"]
  else statuses["Idea"]
  end
end

# Gift data: [recipients, givers, name, status, cost]
# Recipients/givers use normalized strings that will be parsed into individual people
GIFTS = [
  # Jack's Zelda gifts
  ["Jack", nil, "Twilight Princess - Console", "Delivered", 200],
  ["Jack", nil, "Twilight Princess - Game", "Delivered", 90],
  ["Jack", nil, "Twilight Princess - Controller", "Delivered", 45],
  ["Jack", nil, "Ocarina", "Delivered", 120],
  ["Jack", nil, "Zelda Jewels", "Delivered", 200],
  ["Jack", nil, "Zelda Chess", "Delivered", nil],
  ["Jack", nil, "Categories OR Blank Slate game", nil, nil],
  ["Jack", "Mom & Dad", "Blue Jay Shirt", nil, nil],
  
  # Emma's gifts
  ["Emma", nil, "Smart Bird Feeder", "Delivered", nil],
  ["Emma", nil, "Fluffy Crocs", "Idea", nil],
  ["Emma", "Mom & Dad", "Clue Board Game", "Wrapped", 35],
  [nil, "Mom & Dad", "Brawl Stars Guess Who", "Delivered", 50],
  ["Emma", "Mom & Dad", "Bitzee Hamster Ball", "Delivered", nil],
  ["Emma", "Mom & Dad", "Gui Gui Slime", "Delivered", nil],
  ["Emma", "Mom & Dad", "Scooter", nil, nil],
  ["Emma", "Jack", "Baby Three Surprise Dolls x2 + Cat Calendar + Happy Salmon Game", "Delivered", nil],
  ["Emma", "Santa", "My Generation Bunk Bed", "Delivered", nil],
  ["Emma", "Santa", "Bluey Puppets (Unicorse and Bob Billy)", nil, nil],
  ["Emma", "Santa", "Bluey Spot It", nil, nil],
  ["Emma", nil, "Pusheen Bowl", nil, nil],
  ["Emma", nil, "Threshold Game", nil, nil],
  ["Emma", "Mom & Dad", "Squirrel Shirt", nil, nil],
  
  # Stocking stuffers
  ["Emma", "Stocking", "Queen of Farts Game", nil, nil],
  ["Jack", "Stocking", "May Contain Butts Game", nil, nil],
  ["Emma", "Stocking", "Abercrombie Body Spray", nil, nil],
  ["Jack", "Stocking", "Abercrombie Body Spray", nil, nil],
  ["Emma", "Stocking", "Cat vs Pickle", nil, nil],
  ["Jack", "Stocking", "Cat vs Pickle", nil, nil],
  ["Emma", "Stocking", "Cat Sucks", nil, nil],
  
  # Jack ideas
  ["Jack", nil, "Foot Bath", "Idea", nil],
  ["Jack", nil, "Fishing Rod", "Idea", nil],
  ["Jack", nil, "Fishing Lures", "Idea", nil],
  ["Jack", "Grandma & Grandpa", "Sax Lessons", "Idea", nil],
  ["Jack", nil, "Lego Stranger Things", "Idea", nil],
  ["Jack", nil, "Footbath", "Idea", nil],
  
  # Emma ideas
  ["Emma", nil, "Fishing Rod", "Idea", nil],
  ["Emma", nil, "Fishing Lures", "Idea", nil],
  ["Emma", nil, "Wicked Lego", "Idea", nil],
  
  # Joint gifts for Jack & Emma
  ["Jack & Emma", "Grandma & Grandpa", "BEAVERBOT - Cardboard Cutter", "Delivered", nil],
  ["Emma", "Grandma & Grandpa", "Cutter Tools", "Delivered", nil],
  ["Jack & Emma", nil, "Super Mario Galaxy 1 & 2 Switch Edition", "Delivered", 70],
  ["Emma", nil, "Disney Dreamlight Valley, Cozy Edition", "In Transit", 52],
  
  # Nana
  ["Nana", nil, "Sunglasses", "Wrapped", nil],
  ["Nana", nil, "Frame of Us at the Gala", "Idea", nil],
  ["Nana", "Jack & Emma", "Waffles Stuffie", "Wrapped", nil],
  
  # Nonno
  ["Nonno", nil, "Nice Portable Game Chair", nil, 70],
  ["Nonno", nil, "Venom Shirt", nil, 25],
  ["Nonno", "Jack & Emma", "Jays Hat", "Delivered", nil],
  
  # Grandparents
  ["Grandma", "Christina & Kent", "Toothbrush", "Delivered", nil],
  ["Grandpa", "Christina & Kent", "Toothbrush", "Delivered", nil],
  ["Grandpa", "Jack & Emma", "M&M Socks", "Delivered", nil],
  
  # Extended family
  ["Rob", "Fenwicks", "Jays Hat", "Delivered", nil],
  ["Dave", "Fenwicks", "Jays Hat", "Delivered", nil],
  ["Heather", "Christina & Kent & Jack & Emma", "Christmas Vacation Monopoly", "Delivered", nil],
  ["Heather", "Christina & Kent & Jack & Emma", "Roots Sweater + Socks", "Delivered", nil],
  ["Josh", "Christina & Kent & Jack & Emma", "Roots Sweater + Socks", "Delivered", nil],
  
  # Misc / no recipient specified
  [nil, nil, "Smoothie Thing", "Idea", nil],
  [nil, nil, "Birdhouse Maker", "Delivered", nil],
  [nil, nil, "Exploding Kittens Game", "Delivered", nil],
  [nil, nil, "Art Canvas Kit", "Delivered", nil],
]

# Create gifts
position = 0
GIFTS.each do |recipients_str, givers_str, gift_name, status_str, cost|
  next if gift_name.blank?
  
  position += 1
  
  gift = Gift.create!(
    name: gift_name,
    holiday: holiday,
    gift_status: map_status(statuses, status_str),
    cost: parse_cost(cost),
    position: position,
    created_by_user_id: user.id
  )
  
  # Add recipients
  parse_people(people, recipients_str).each do |person|
    GiftRecipient.create!(gift: gift, person: person)
  end
  
  # Add givers
  parse_people(people, givers_str).each do |person|
    GiftGiver.create!(gift: gift, person: person)
  end
  
  puts "  Created: #{gift_name}"
end

puts "\nDone! Created #{position} gifts for Christmas 2025."
puts "People: #{people.keys.sort.join(', ')}"
