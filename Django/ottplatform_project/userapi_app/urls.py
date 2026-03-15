from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.Signup, name='signup'),
    path('login/', views.userlogin, name='userlogin'),
    path('movies/<int:movie_id>/', views.movie_details, name='movie_details'),
    path('movies/<str:genre>/', views.list_movie, name='list_movie'),
    
     path('featured-movies/', views.featured_movies, name='featured_movies'),
     path ('movies-by-genre/', views.movies_by_genre, name='movies_by_genre'),
    path('watchlist/', views.watch_list_add, name='watch_list'),
    path('watchlist/view/', views.watch_list, name='watch_list_view'),
    path('watchlist/remove/', views.remove_from_watchlist, name='watch_list_remove'),
    path('watchhistory/add/', views.watch_history_add, name='watch_history_add'),
    path('watchhistory/view/', views.watch_history, name='watch_history_view'),
    path('search/', views.search_movies, name='search_movies'),
    path('change_password/', views.change_password, name='change_password'),
]