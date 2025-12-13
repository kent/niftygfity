Rails.application.routes.draw do
  resources :gifts do
    member do
      patch :reorder
    end
  end
  resources :gift_statuses
  resources :holidays do
    collection do
      get :templates
      post :join
    end
    member do
      get :share
      post :share
      delete :leave
      get :collaborators
      delete "collaborators/:user_id", action: :remove_collaborator, as: :remove_collaborator
    end
    resources :match_arrangements, only: [:index], controller: "match_arrangements", action: :by_holiday
  end

  resources :match_arrangements, only: %i[index show create update destroy]
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
  get "billing/charity_stats" => "billing#charity_stats"
  post "billing/create_checkout_session" => "billing#create_checkout_session"
  post "billing/redeem_coupon" => "billing#redeem_coupon"
  post "billing/webhook" => "billing#webhook"

  # Profile
  post "profile/sync" => "profile#sync"

  # Notification preferences (authenticated)
  resource :notification_preferences, only: %i[show update] do
    get :email_history, on: :collection
  end

  # Email preferences (token-based, no auth)
  get "email_preferences/:token" => "email_preferences#show"
  patch "email_preferences/:token" => "email_preferences#update"

  # Health check endpoints
  get "up" => "rails/health#show", as: :rails_health_check
  get "/" => "health#show", as: :api_health

  root "health#show"
end
