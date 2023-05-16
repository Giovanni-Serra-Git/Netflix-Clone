import { apiKey,imageBaseUrl } from "./api.js";

import { returnCards, getArrayResult, getCardWidth, getMovieId } from "./global.js";

window.localStorage.clear();
window.localStorage.setItem("idMovie", "76600");

const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
const popularMovies = document.querySelector("[popular-movies]");

const homePageSection =  [
    {
        title: "Upcoming Movies",
        path: "/movie/upcoming",
        shortTitle: "upcoming",
    },
    {
        title: "Trending Movies",
        path: "/trending/movie/week",
        shortTitle: "trending",
    },
    {
        title: "Top Rated Movie",
        path: "/movie/top_rated",
        shortTitle: "top-rated",
    },
];

function getPopularMovies({ results }) {
  for ( const [id,list] of Object.entries(results) ) {
    const {title,backdrop_path, poster_path, overview,release_date, vote_average,genre_ids,id} = list;
    let releaseDate = release_date.split("-").slice(0,1).join(""); 
    let voteAverage = vote_average.toFixed(1);
    let resultArray = [
        title,
        backdrop_path,
        poster_path,
        overview,
        releaseDate,
        voteAverage,
        genre_ids,
        id
    ];
    createPopularCard(...resultArray);
  }
}


let idMovie = window.localStorage.getItem("id");



function createPopularCard(title,backdrop_path, poster_path, overview, releaseDate, voteAverage,genre_ids,id) {


    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("pointer");
    card.setAttribute("card-poster","");
    card.setAttribute("genre-id", genre_ids);
    card.setAttribute("movie-id", id);
    card.setAttribute("overview", overview);
    card.setAttribute("vote", voteAverage);
    card.setAttribute("title", title);
    card.setAttribute("date", releaseDate);
    let img = document.createElement("img");
    img.setAttribute("src",imageBaseUrl + (backdrop_path || poster_path));
    img.setAttribute("alt",title);
    card.appendChild(img);
    card.style.background = "linear-gradient(hsla(220, 17%, 7%) 0%, hsla(220, 100%, 100%, 0) 100%)";
    popularMovies.appendChild(card); 
}    

fetch(popularMoviesUrl)
    .then( (response) => response.json() )
    .then( data => getPopularMovies(data) )
    .then( () => {
        document.querySelectorAll("[card-poster]").forEach(card => {
            card.addEventListener("click", () => {
                let popularCardImage = card.querySelector("img").getAttribute("src");
                let title = card.getAttribute("title");
                let releaseDate = card.getAttribute("date");
                let voteAverage = card.getAttribute("vote");
                let overview = card.getAttribute("overview");
                let posterImage = document.querySelector("[poster-image]");
                let posterTitle = document.querySelector("[poster-title]");
                let posterDate = document.querySelector("[poster-release-date]");
                let posterVote = document.querySelector("[poster-vote-average]");
                let posterOverview = document.querySelector("[poster-overview]");
                posterImage.setAttribute("src",popularCardImage)
                posterTitle.innerHTML = title;
                posterDate.innerHTML =  releaseDate;
                posterVote.innerHTML =  voteAverage
                posterOverview.innerHTML =  overview;
            })
    
        })
    } )
    .then( () => {
        let cardPoster = document.querySelectorAll("[card-poster]");
        cardPoster.forEach(card => {
            card.addEventListener("click", (e) => {
                if (e.target.closest(".active")) {
                    return;
                } else {
                    cardPoster.forEach(card => card.classList.contains("active") ? card.classList.remove("active") : null);
                    card.classList.add("active");
                }
            })
        })
    } );


homePageSection.forEach( (section,index) => { 

    let cardWidth;

    const { title, shortTitle, path } = section;

    document.querySelectorAll("[meta-item-movie]")[index].innerHTML = title; 

    let metaItemMovie = document.querySelectorAll("[meta-item-movie]");
    metaItemMovie


    metaItemMovie[index].innerHTML += ` 
    <div class="${shortTitle}-movies meta-item flex flex-column relative" parent-slider parent-slider-home-page path="${path}">
        <div class="slider-control__container overflow-hidden">
            <div class="slider-control__inner slider-wrapper flex relative" slider-wrapper slider-wrapper-home-page>
            
            </div>
        </div>    
        <div class="arrow-container flex flex-align-center flex-between" slider>
            <div class="arrow-left flex flex-center" arrow arrow-left><span class="color-theme-white">&lharu;</span></div>
            <div class="arrow-right flex flex-center" arrow arrow-right><span class="color-theme-white">&#8640;</span></div>      
        </div>  
    </div>
    ` 
    let pathUrl = `https://api.themoviedb.org/3/${path}?api_key=${apiKey}&language=en-US&page=1`;

    fetch(pathUrl)
    .then(response => response.json())
    .then(data => movieListHomePage(data, index))
    .then( () => getCardWidth("[slider-wrapper-home-page]" ) )

})



export function movieListHomePage( { results }, index ) {
    results.forEach(result => {
        document.querySelectorAll("[slider-wrapper-home-page]")[index].innerHTML +=  returnCards(...getArrayResult(imageBaseUrl, result));
        document.querySelectorAll("[meta-item-card]").forEach(card => {
            card.addEventListener("click", getMovieId);
        })
    })
}