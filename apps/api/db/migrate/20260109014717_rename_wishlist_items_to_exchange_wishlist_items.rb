class RenameWishlistItemsToExchangeWishlistItems < ActiveRecord::Migration[8.1]
  def change
    # Rails automatically renames indexes when renaming tables in PostgreSQL
    rename_table :wishlist_items, :exchange_wishlist_items
  end
end
