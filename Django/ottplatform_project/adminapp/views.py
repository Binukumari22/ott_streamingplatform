from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect, get_object_or_404 
from django.core.paginator import Paginator  
from .models import Movie   



from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login

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

def settings(request):
    
    
    
    return render(request,'accsettings.html')

def movies(request):
    movies = Movie.objects.all().order_by('id')

    paginator = Paginator(movies, 3)   # 5 movies per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'movies.html', {
        'page_obj': page_obj
    })
   
    
     

def movie_details(request, movie_id):

    movie = get_object_or_404(Movie, id=movie_id)

    return render(request, 'movie_details.html', {
        'movie': movie
    })

def user_history(request, user_id):
    return render(request, 'user_history.html')



def report(request):
    reports = [
        {"movie": "Inception", "count": 150},
        {"movie": "Interstellar", "count": 120},
        {"movie": "The Dark Knight", "count": 95},
        {"movie": "Avatar", "count": 60},
        {"movie": "Titanic", "count": 30},
    ]

    # already ordered high → low for learning
    return render(request, "report.html", {"reports": reports})

def addmovies(request):
    return render(request,'add_movie.html')



def editmovie(request, movie_id):

    # get the movie object
    movie = get_object_or_404(Movie, id=movie_id)

    # when form submitted
    if request.method == "POST":
        movie.title = request.POST.get('title')
        movie.description = request.POST.get('description')

        # update image if new one uploaded
        if request.FILES.get('image'):
            movie.image = request.FILES.get('image')

        # update video if new one uploaded
        if request.FILES.get('video'):
            movie.video = request.FILES.get('video')

        movie.save()

        return redirect('movies')  # go back to movies page

    return render(request, 'edit_movie.html', {'movie': movie})



def delete_movie(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    movie.delete()
    return redirect('movies')


    

