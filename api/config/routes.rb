Rails.application.routes.draw do
  namespace :v1 do
    get 'tags/search', to: 'tags#search'
    get 'users/search', to: 'users#search'
    get 'posts/search', to: 'posts#search'
    get 'users/isFollowed', to: 'users#isFollowed'
    get 'users/test', to: 'users#test'
    resources :users do
      member do
        patch '/update_avatar', to: 'users#update_avatar'
        get '/following', to: 'users#following'
        get '/followers', to: 'users#followers'
        get '/posts', to: 'users#posts'
      end
    end
    resources :relationships, only: [:create, :destroy]
    resources :posts
    resources :likes, only: [:create, :destroy]
    resources :comments, only: [:create, :destroy]
    resources :boards
    resources :board_comments
    resources :tags
    resources :user_tag_maps, only: [:create, :destroy]
    resources :tasks, only: :index
    resources :notices, only: [:index]
    get '/notices/unchecked', to: 'notices#unchecked'
    get '/notices/checked', to: 'notices#checked'
    resources :gadgets, only: [:index, :create, :show, :update, :destroy]
  end
end