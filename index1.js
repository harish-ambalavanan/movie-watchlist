const apiKey = "f793ce55"
const movieSearchInput = document.getElementById("movie-search-input")
const movieSearchButton = document.getElementById("search-button")
const movieListContainer = document.getElementById("movie-list-container")
const centerText = document.getElementById("center-quote-homepage")
const movieNotFound = document.getElementById("not-found")
const loadingContainer = document.getElementById("loading-container");
// const addMovieToWatchlist = document.getElementById("movie-add-watchlist")

movieSearchButton.addEventListener('click', handleMovieSearchClick)

movieSearchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        // console.log("CLICKED ON ENTER")
        handleMovieSearchClick()
    }
})

function handleMovieSearchClick(){
    const searchedMovie = movieSearchInput.value
    console.log("SEARCHED MOVIE: " + searchedMovie);
    centerText.classList.add('hidden')
    movieNotFound.classList.add('hidden')
    // movieListContainer.classList.add('hidden')
    movieListContainer.innerHTML = ''
    loadingContainer.classList.remove("hidden");
    handleAPIcallForMovieSearch(searchedMovie)
}

function handleAPIcallForMovieSearch(searchedMovie){
    const searchedMovies = []
    let detailedMovieData = []
    
    fetch(`http://www.omdbapi.com/?s=${searchedMovie}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                // searchedMovies.push(...data.Search);
                return Promise.all(data.Search.map(movie => fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`)));
            }
            return [];
        })
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(detailedData => {
            detailedMovieData = detailedData;
            console.log(detailedMovieData);
            const containerId = 'movie-list-container';
            handleMoviesRendering(detailedData)
        })
        .catch(error => {
            console.error('Error in async/await loop:', error);
            // Handle the error as needed
        })
}

function handleMoviesRendering(movies){ 
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

            

            const addToWatchlistElement = document.createElement('p')
            addToWatchlistElement.textContent = "Add to Watchlist"
            addToWatchlistElement.style.fontWeight = 600
            addToWatchlistElement.dataset.movieId = movie.imdbID

            movieDetailsDiv.append(movieDurationElement, movieGenreElement, addToWatchlistElement)
            
            const movieDescriptionElement = document.createElement('p')
            movieDescriptionElement.textContent = movie.Plot

            innerFlexDiv.append(movieHeaderDiv, movieDetailsDiv, movieDescriptionElement)
            individualMovieDiv.append(imageDiv, innerFlexDiv)
            fragment.appendChild(individualMovieDiv);
        })
        console.log(html)
        centerText.classList.add('hidden')
        movieNotFound.classList.add('hidden')
        // movieListContainer.classList.remove('hidden')
        loadingContainer.classList.add("hidden");
        movieListContainer.appendChild(fragment)
        // movieListContainer.innerHTML = html
    }else{
        // movieListContainer.classList.add('hidden')
        centerText.classList.add('hidden')
        loadingContainer.classList.add("hidden");
        movieNotFound.classList.remove('hidden')
    }
}

document.addEventListener('click', async (event)=>{
    console.log(event);
    const imdbID = event.target.dataset.movieId
    if(imdbID){
        console.log(imdbID)
        const movieDataFetch = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
        const movieData = await movieDataFetch.json()
        console.log(movieData);
        saveToLocalStorage(movieData)
    } else {
        console.log("not clicked");
    }
    
})

function handleImageError(image) {
    image.onerror = null; // To prevent infinite loop in case the placeholder image also fails to load
    image.src = 'path_to_placeholder_image.jpg';
    image.alt = 'Image Not Available';
}


function saveToLocalStorage(movie) {
    // Check if localStorage is supported by the browser
    if (typeof Storage !== 'undefined') {
        const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
        const isDuplicate = savedMovies.some(savedMovie => savedMovie.imdbID === movie.imdbID);
        if(!isDuplicate){
            savedMovies.push(movie);
            localStorage.setItem('savedMovies', JSON.stringify(savedMovies))
        } else{
            console.log("Already Added in localStorage");
        }
    } else {
        console.error('LocalStorage is not supported in this browser.');
    }
}

// document.getElementById('watch-list').addEventListener('click', () => {
//     const getLocallacyStoredMovies = JSON.parse(localStorage.getItem('savedMovies'))
//     const containerId = 'movie-list-container';
//     handleMoviesRendering(getLocallacyStoredMovies)
// })


// function handleMoviesRendering(movies) {
//     const containerId = 'movie-list-container';
//     renderMovies(containerId, movies);
// }



// function handleAPIcallForMovieSearch(searchedMovie) {
//     const searchedMovies = [];
//     const detailedMovieData = [];

//     fetch(`http://www.omdbapi.com/?s=${searchedMovie}&apikey=${apiKey}`)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data.Response);
//             if (data.Response === 'True') {
//                 searchedMovies.push(...data.Search);
//                 const fetchPromises = searchedMovies.map(movie => {
//                     return fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`)
//                         .then(response => response.json())
//                         .then(detailedData => detailedMovieData.push(detailedData))
//                         .catch(error => {
//                             console.error('Error in fetch operation:', error);
//                             // Handle the error as needed
//                         });
//                 });

//                 return Promise.all(fetchPromises);
//             }
//         })
//         .then(() => {
//             console.log(detailedMovieData);
//         })
//         .catch(error => {
//             console.error('Error in fetch operation:', error);
//             // Handle the error as needed
//         });
// }