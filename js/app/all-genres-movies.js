import { apiKey, imageBaseUrl } from "./api.js";
import { getMovieId, returnCards, getArrayResult, getCardWidth } from "../app/global.js";


let genreId = window.localStorage.getItem("genre_id")
let genreName = window.localStorage.getItem("genre-name");
let currentPage = 1;
let cardWidth;
let sameGenreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&${genreId}`;
let totalPages;

fetch(sameGenreUrl)
    .then( response => response.json() )
    .then( (data) => createCard(data) )
    .then( () => { getCardWidth("[all-genre-movies]") } )



function createCard( { results, total_pages }) {

    totalPages = total_pages;

    results.forEach(result => {

        document.querySelector("[genre-movie]").innerText = `all ${genreName} movies`;

        document.querySelector("[all-genre-movies]").innerHTML += returnCards(...getArrayResult(imageBaseUrl,result))
    })    
}

document.querySelector(".all-genre-movies").innerHTML += `
    <button class="load-more flex flex-align-center capitalize pointer fs-100 fw-bold theme-color-white theme-bg-primary" load-more>load more</button>
`;


document.querySelector("[load-more]").addEventListener("click", (e) => {
    
if (currentPage != totalPages)  {
    e.target.classList.add("loading");
    setTimeout( () => {
        currentPage++;
        sameGenreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&${genreId}`
        e.target.classList.remove("loading");
        fetch(sameGenreUrl)
        .then( response => response.json() )
        .then( (data) => createCard(data) )
        .then( () => {
            getCardWidth("[all-genre-movies]")
            document.querySelectorAll(".card").forEach(card => card.addEventListener("click", getMovieId));
    } );

    return currentPage == totalPages ?  e.target.style.display = "none" : null;

    }, 2000 )
}
})

   