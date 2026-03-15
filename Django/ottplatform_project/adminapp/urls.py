from django.urls import path
from . import views


urlpatterns = [
    path('', views.adminlogin,name='adminlogin'),
    path('movies/', views.movies,name='movies'),
    path('movie_details/<int:movie_id>/', views.movie_details, name='movie_details'),
   
    path('report/', views.report, name='report'),
    path('accsettings/', views.settings,name='accsettings'),
    path("users/history/<int:user_id>/", views.user_history, name="user_history"),
    path("movies/add/", views.addmovies, name="add_movie"),
    path('editmovie/<int:movie_id>/', views.editmovie, name='editmovie'),
    path('movies/delete/<int:movie_id>/', views.delete_movie, name='delete_movie'),
]
    



