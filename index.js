const apiKey = "f793ce55"
const movieSearchInput = document.getElementById("movie-search-input")
const movieSearchButton = document.getElementById("search-button")
const movieListContainer = document.getElementById("movie-list")
const centerText = document.getElementById("center-quote-homepage")
const movieNotFound = document.getElementById("not-found")
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
    // console.log(searchedMovie);
    handleAPIcallForMovieSearch(searchedMovie)
}

function handleAPIcallForMovieSearch(searchedMovie){
    const searchedMovies = []
    const detailedMovieData = []
    
    fetch(`http://www.omdbapi.com/?s=${searchedMovie}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.Response)
            if(data.Response === 'True'){
                data.Search.forEach((item) => {
                    searchedMovies.push(item)   
                })
                // searchedMovies.push(data.Search)   
                // console.log(searchedMovies);
                // return searchedMovies//Wrongly put return here
            }else{
                handleMoviesRendering([]);
            }
            return searchedMovies
        })
        .then(async (movies) => {
            const detailedMovieData = [];
        
            for (const movie of movies) {
                try {
                    const response = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
                    const data = await response.json();
                    detailedMovieData.push(data);
                } catch (error) {
                    console.error('Error in fetch operation:', error);
                    // Handle the error as needed
                }
            }
        
            console.log(detailedMovieData);
            return detailedMovieData
            // Continue with rendering or other processing
        })
        .catch(error => {
            console.error('Error in async/await loop:', error);
            // Handle the error as needed
        })
        
        .then(data => {
            console.log(data)
            handleMoviesRendering(data)
        })
}

// function handleMoviesRendering(movies){
//     let html = ``
//     if(movies.length >= 1){
//         movies.forEach((movie) => {
//             html += `
//             <div class="individual-movie">
//                 <div class="image-div col1">
//                     <img src="${movie.Poster}" alt="">
//                 </div>
//                 <div class="inner-flex col2">
//                     <div class="movie-header">
//                         <h2 id="movie-tile" class="movie-title">${movie.Title}</h2>
//                         <i id="STAR-ICON" class="id="STAR-ICON""></i>
//                         <p id="ratings">${movie.imdbRating}</p>
//                     </div>
        
//                     <div class="movie-details">
//                         <p id="movie-duration">${movie.Runtime}</p>
//                         <p id="movie-genres">${movie.Genre}</p>
//                         <p data-movie-id="${movie.imdbID}">Watchlist</p>
//                     </div>
        
//                     <p id="movie-description">${movie.Plot}</p>
//                 </div>
//             </div>
//             `
//         })
//         console.log(html)
//         centerText.classList.add('hidden')
//         movieListContainer.innerHTML = html
//     }else{
//         centerText.classList.add('hidden')
//         movieNotFound.classList.remove('hidden')
//     }
// }

document.addEventListener('click', (event)=>{
    console.log(event);
    const imdbID = event.target.dataset.imdbID
    console.log(imdbID)
})

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