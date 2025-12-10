class CursorChannel < ApplicationCable::Channel
  def subscribed
    holiday_id = params[:holiday_id]
    reject unless holiday_id && authorized_for_holiday?(holiday_id)
    stream_from "cursors:#{holiday_id}"
  end

  def move(data)
    holiday_id = params[:holiday_id]
    ActionCable.server.broadcast("cursors:#{holiday_id}", {
      user_id: current_user.id,
      clerk_user_id: current_user.clerk_user_id,
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      image_url: current_user.image_url,
      x: data["x"],
      y: data["y"]
    })
  end

  private

  def authorized_for_holiday?(holiday_id)
    Holiday.joins(:holiday_users)
           .where(id: holiday_id, holiday_users: { user_id: current_user.id })
           .exists?
  end
end
