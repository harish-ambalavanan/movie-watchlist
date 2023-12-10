const centerQuote = document.getElementById('center-quote-watchlist')
const addSomeMovies = document.getElementById('add-some-movies')
const movieListContainer = document.getElementById('movie-list-container')

document.addEventListener('DOMContentLoaded', () => {
    console.log("ON LOADED");
    // const savedMovies = getSavedMovies();
    const storedMovies = JSON.parse(localStorage.getItem('savedMovies'))
    const containerId = 'movie-list-container';
    movieListContainer.innerHTML = ''
    handleMoviesRendering(containerId, storedMovies);
});


function handleMoviesRendering(containerId, movies){
    let html = ``
    if(movies.length >= 1){
    
        const fragment = document.createDocumentFragment()
        movies.forEach((movie) => {
            
            const poster = movie.Poster !== 'N/A' ? movie.Poster : 'path_to_placeholder_image.jpg';

            const individualMovieDiv = document.createElement('div')
            individualMovieDiv.classList.add('individual-movie')

            const imageDiv = document.createElement('div')
            imageDiv.classList.add('image-div', 'col1')

            const imageElement = document.createElement('img')
            imageElement.src = poster
            imageElement.alt = `{movie.Title} Poster`
            imageElement.onerror = () => handleImageError(imageElement)

            imageDiv.appendChild(imageElement)

            const innerFlexDiv = document.createElement('div')
            innerFlexDiv.classList.add('inner-flex')

            const movieHeaderDiv = document.createElement('div')
            movieHeaderDiv.classList.add('movie-header')

            const movieTitleElement = document.createElement('h2')
            movieTitleElement.textContent = movie.Title
            movieTitleElement.classList.add('movie-title')

            const starIconElement = document.createElement('i')
            starIconElement.classList.add('star')

            const movieRatingsElement = document.createElement('p')
            movieRatingsElement.textContent = movie.imdbRating


            movieHeaderDiv.append(movieTitleElement, starIconElement, movieRatingsElement)
            innerFlexDiv.appendChild(movieHeaderDiv)

            const movieDetailsDiv = document.createElement('div')
            movieDetailsDiv.classList.add('movie-details')

            const movieDurationElement = document.createElement('p')
            movieDurationElement.textContent = movie.Runtime

            const movieGenreElement = document.createElement('p')
            movieGenreElement.textContent = movie.Genre

            const removeFromWatchlistElement = document.createElement('p')
            removeFromWatchlistElement.textContent = "Add to Watchlist"
            removeFromWatchlistElement.style.fontWeight = 600
            removeFromWatchlistElement.dataset.movieId = movie.imdbID

            movieDetailsDiv.append(movieDurationElement, movieGenreElement, removeFromWatchlistElement)
            
            const movieDescriptionElement = document.createElement('p')
            movieDescriptionElement.textContent = movie.Plot

            innerFlexDiv.append(movieHeaderDiv, movieDetailsDiv, movieDescriptionElement)
            individualMovieDiv.append(imageDiv, innerFlexDiv)
            fragment.appendChild(individualMovieDiv);
        })
        console.log(html)
        centerQuote.classList.add('hidden')
        addSomeMovies.classList.add('hidden')
        // movieListContainer.classList.remove('hidden')
        movieListContainer.appendChild(fragment)
        // movieListContainer.innerHTML = html
    }else{
        // movieListContainer.classList.add('hidden')
        centerQuote.classList.remove('hidden')
        addSomeMovies.classList.remove('hidden')
    }
}

document.addEventListener('click', async (event)=>{
    console.log(event);
    const imdbID = event.target.dataset.movieId
    if(imdbID){
        console.log(imdbID)
        const movieData = await movieDataFetch.json()
        console.log(movieData);
        saveToLocalStorage(movieData)
    } else {
        console.log("not clicked");
    }
    
})