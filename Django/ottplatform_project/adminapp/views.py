
from django.contrib.auth import authenticate, login
from django.shortcuts import render,redirect, get_object_or_404 
from django.core.paginator import Paginator  
from .models import Movie , User , Watchlist,watchHistory
from django.db.models import Q, Count  


# LOGIN
def adminlogin(request):

    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        print(f"Attempting login with email: {email} and password: {password}")

        user = authenticate(request, email=email, password=password)

        if user is not None and user.is_admin:
            login(request, user)
            print(f"Login successful for user: {user.email}")
            return redirect('/movies/')

        return render(request, 'login.html', {'error': 'Invalid credentials or not an admin.'})

    return render(request, 'login.html')



def movies(request):
    search_query = request.GET.get('search', '')
    movies = Movie.objects.all().order_by('id')
    if search_query:
        movies = movies.filter(title__icontains=search_query)
        
    paginator = Paginator(movies, 3)   # 5 movies per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'movies.html', {
        'page_obj': page_obj
    })
   
    
     

def movie_details(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    return render(request, 'movie_details.html', {'movie': movie})




def add_movie(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        genre = request.POST.get('genre')   
        description = request.POST.get('description')
        thumbnail = request.FILES.get('thumbnail')
        video = request.FILES.get('video')
        
          
        is_featured = request.POST.get('featured') == 'on'

        # Save to database
        Movie.objects.create(
            title=title,
            genre=genre,
            description=description,
            thumbnail=thumbnail,
            video=video,
            is_featured=is_featured,
        )

        return redirect('movies')  # after save

    return render(request, 'add_movie.html')



def editmovie(request, movie_id):

    movie = get_object_or_404(Movie, id=movie_id)

    if request.method == "POST":
        
        movie.title = request.POST.get('title') or movie.title
        movie.genre = request.POST.get('genre') or movie.genre
        movie.description = request.POST.get('description') or movie.description

     
        movie.featured = request.POST.get('featured') == 'on'

        
        if request.FILES.get('thumbnail'):
            movie.thumbnail = request.FILES.get('thumbnail')

        if request.FILES.get('video'):
            movie.video = request.FILES.get('video')

        movie.save()

        return redirect('movies')

    return render(request, 'edit_movie.html', {'movie': movie})



def delete_movie(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    movie.delete()
    return redirect('movies')

def settings(request):
    return render(request,'accsettings.html')


#  USERS LIST + SEARCH
def users(request):
    search_query = request.GET.get('search')

    users = User.objects.all().order_by('id')
    print(User.objects.all())
    

    #  SEARCH
    if search_query:
        users = users.filter(
            Q(username__icontains=search_query) |
            Q(email__icontains=search_query)
        )

    return render(request, 'users.html', {
        'users': users
    })


# BLOCK USER
def block_user(request, user_id):
    user = get_object_or_404(User, id=user_id)

    user.is_blocked = True
    user.save()

    return redirect('users')


# UNBLOCK USER
def unblock_user(request, user_id):
    user = get_object_or_404(User, id=user_id)

    user.is_blocked = False
    user.save()

    return redirect('users')



# REPORT

def report(request):

    reports = (
        watchHistory.objects
        .values('movie__id', 'movie__title')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    return render(request, 'report.html', {
        'reports': reports
    })

def all_user_history(request):
    
    history = watchHistory.objects.all().select_related('user', 'movie')

    return render(request, 'user_history.html', {
        'history': history
    })

    

