import { apiKey, imageBaseUrl } from "./api.js";
import {  getMovieId, returnCards, getArrayResult, getCardWidth } from "./global.js";

let language = window.localStorage.getItem("language");
let languageString = window.localStorage.getItem("language-string");
let languageCaption = document.querySelector("[all-results-caption]");
let resultsMovieContainer = document.querySelector("[all-results-movie-container]");
let resultsMovieList = document.querySelector("[all-results-movies-list]");
let totalPages;
let currentPage = 1;
let cardWidth;
let movieLanguageUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&${language}`;

languageCaption.innerHTML = `all ${languageString} movies`;



fetch(movieLanguageUrl)
.then( response => response.json() )
.then( data => createCard(data) )
.then( () => { getCardWidth("[all-results-movies-list]") } )
.then( () => {

    document.querySelectorAll(".card").forEach(card => card.addEventListener("click", getMovieId));


    document.querySelector("[load-more]").addEventListener("click", (e) => {
    
        if (currentPage != totalPages)  {
            e.target.classList.add("loading");
            setTimeout( () => {
                currentPage++;
                movieLanguageUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&${language}`;
                e.target.classList.remove("loading");
                console.log(movieLanguageUrl);
                fetch(movieLanguageUrl)
                .then( response => response.json() )
                .then( (data) => createCard(data) )
                .then( () => {
                    document.querySelectorAll(".card").forEach(card => card.addEventListener("click", getMovieId));
            } )
            .then( () => getCardWidth("[all-results-movies-list]") )
        
            return currentPage == totalPages ?  e.target.style.display = "none" : null;
        
            }, 2000 )
        }
    })
} )




function createCard( { results, total_pages }) {


    
    totalPages = total_pages;

    results.forEach(result => {
        resultsMovieList.innerHTML += returnCards(...getArrayResult(imageBaseUrl, result));
    })    
}    


   
