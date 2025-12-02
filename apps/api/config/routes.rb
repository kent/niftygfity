Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }

  resources :gifts do
    member do
      patch :reorder
    end
  end
  resources :gift_statuses
  resources :holidays do
    collection do
      get :templates
    end
  end
  resources :people do
    resources :gift_suggestions, only: %i[index create] do
      collection do
        post :refine
      end
    end
  end

  resources :gift_suggestions, only: %i[destroy] do
    member do
      post :accept
    end
  end

  # Billing
  get "billing/status" => "billing#status"
  post "billing/create_checkout_session" => "billing#create_checkout_session"
  post "billing/redeem_coupon" => "billing#redeem_coupon"
  post "billing/webhook" => "billing#webhook"

  # Health check endpoints
  get "up" => "rails/health#show", as: :rails_health_check
  get "/" => "health#show", as: :api_health

  root "health#show"
end
