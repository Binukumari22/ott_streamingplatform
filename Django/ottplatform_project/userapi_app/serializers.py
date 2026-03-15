from rest_framework import serializers
from adminapp.models import Movie, Watchlist,User,watchHistory   

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class WatchlistSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    class Meta:
        model = Watchlist
        fields = '__all__'
        
class WatchHistorySerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)

    class Meta:
        model = watchHistory
        fields = ['id', 'movie', 'watched_at']