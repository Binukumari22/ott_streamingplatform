from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from collections import defaultdict
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token
from adminapp.models import Movie, User , Watchlist,watchHistory
from userapi_app.serializers import MovieSerializer
from userapi_app.serializers import WatchlistSerializer,WatchHistorySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework import permissions




@api_view(['POST'])
@permission_classes((AllowAny,))

def Signup(request):
    email = request.data.get("email")
    password = request.data.get("password")
    name = request.data.get("name")

    if not name or not email or not password:
        return Response({'message': 'All fields are required'})

    if User.objects.filter(email=email).exists():
        return JsonResponse({'message': 'Email already exist'})

    user = User.objects.create_user(email=email, password=password)
    user.name = name
    user.save()

    return JsonResponse({'message': 'user created successsfully'}, status=200)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))

def userlogin(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if email is None or password is None:
        return Response({'error': 'Please provide both email and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=email, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key},status=HTTP_200_OK)

@api_view(['GET'])
@permission_classes((AllowAny,))
def featured_movies(request):
    movies = Movie.objects.filter(is_featured=True)[:7]
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)

def movies_by_genre(request):

    movies = Movie.objects.all()

    result = defaultdict(list)

    for movie in movies:
        result[movie.genre].append({
            "id": movie.id,
            "title": movie.title,
            "thumbnail": movie.thumbnail.url
        })

    return JsonResponse(result)

@api_view(['GET'])
@permission_classes((AllowAny,))
def list_movie(request, genre):
    movies = Movie.objects.filter(genre=genre)
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def watch_list_add(request):
    user_id = request.data.get('user_id')
    movie_id = request.data.get('movie_id')
    try:
        user = User.objects.get(id=user_id)
        movie = Movie.objects.get(id=movie_id)  
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Movie.DoesNotExist:
        return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
    watch_list = Watchlist.objects.create(user=user, movie=movie)
    return Response({'message': 'Movie added to watchlist'}, status=status.HTTP_201_CREATED)
  
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def watch_list(request):
    user = request.user
    watchlist = Watchlist.objects.filter(user=user)
    serializer = WatchlistSerializer(watchlist, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes((IsAuthenticated,))
def remove_from_watchlist(request):

    user = request.user
    movie_id = request.data.get('movie_id')

    try:
        movie = Movie.objects.get(id=movie_id)
        watchlist_item = Watchlist.objects.get(user=user, movie=movie)
        watchlist_item.delete()

        return Response(
            {'message': 'Movie removed from watchlist'},
            status=status.HTTP_200_OK
        )

    except Movie.DoesNotExist:
        return Response(
            {'error': 'Movie not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    except Watchlist.DoesNotExist:
        return Response(
            {'error': 'Movie not in your watchlist'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def watch_history_add(request):

    user = request.user
    movie_id = request.data.get('movie_id')

    try:
        movie = Movie.objects.get(id=movie_id)
    except Movie.DoesNotExist:
        return Response(
            {'error': 'Movie not found'},status=status.HTTP_404_NOT_FOUND)

    watch_history = watchHistory.objects.create(user=user,movie=movie )

    return Response({'message': 'Movie added to watch history'},status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def watch_history(request):

    user = request.user

    watch_history = watchHistory.objects.filter(
        user=user
    ).order_by('-watched_at')

    unique_movies = {}

    for entry in watch_history:
        unique_movies[entry.movie.id] = entry

    serializer = WatchHistorySerializer(
        unique_movies.values(),
        many=True
    )

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def search_movies(request):
    query = request.query_params.get('query', '')

    if not query:
        return Response( {"error": "Search query is required"},status=400)

    movies = Movie.objects.filter(title__icontains=query)
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
def change_password(request):

    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not user.check_password(old_password):
        return Response(
            {'error': 'Old password is incorrect'},status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response(
        {'message': 'Password changed successfully'},status=status.HTTP_200_OK)
    
    
@api_view(['GET'])
def movie_details(request, movie_id):

    try:
        movie = Movie.objects.get(id=movie_id)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)

    serializer = MovieSerializer(movie)

    return Response(serializer.data)