class GuestClaimMailer < ApplicationMailer
  def claim_confirmation(claim)
    @claim = claim
    @item = claim.wishlist_item
    @wishlist = @item.wishlist
    @owner_name = @wishlist.user.safe_name
    @frontend_url = ENV.fetch("FRONTEND_URL", "https://listygifty.com")
    @manage_url = "#{@frontend_url}/claim/#{claim.claim_token}"

    mail(
      to: claim.claimer_email,
      subject: "You've reserved \"#{@item.name}\" from #{@owner_name}'s wishlist"
    )
  end
end
