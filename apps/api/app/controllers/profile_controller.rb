class ProfileController < ApplicationController
  # POST /profile/sync - Force sync user data from Clerk
  def sync
    clerk_user = fetch_clerk_user(current_user.clerk_user_id)

    if clerk_user
      current_user.update!(
        first_name: clerk_user.first_name,
        last_name: clerk_user.last_name,
        image_url: clerk_user.image_url,
        phone: clerk_user_phone(clerk_user),
        username: clerk_user.username
      )
    end

    render json: UserBlueprint.render_as_hash(current_user)
  end
end

