import { apiKey, imageBaseUrl } from "../app/api.js";

import { getMovieId, returnCards, getArrayResult } from "../app/global.js";

let idMovie = window.localStorage.getItem("idMovie");
let detailsMovieUrl = `https://api.themoviedb.org/3/movie/${idMovie}?api_key=${apiKey}&language=en-US&append_to_response=casts%2Cvideos%2Creleases`;
let similarMoviesUrl = `https://api.themoviedb.org/3/movie/${idMovie}/recommendations?api_key=${apiKey}&language=en-US&page=1`;
let mayAlsoLike = document.querySelector(".slider-control__may-also-like");
let sliderTrailers = document.querySelector("[slider-control__container-clips]");
let cardWidth;
let cardHeight;

fetch(detailsMovieUrl)
.then(response => response.json())
.then(data => detailsMovie(data))
.then( () => {
  let cardTrailers = document.querySelectorAll("[trailer-clips-card]");
  if (cardTrailers.length <= 3) {
    document.querySelectorAll("[trailer-clips-card]").forEach(card => {
      card.style.flex = "0 0 300px";
      card.style.height = 300 + "px";
      console.log(card);
    })
  }

  if (cardTrailers.length == 0) sliderTrailers.classList.remove("active");
} )

function detailsMovie(movie) {    
    const {
        backdrop_path,
        poster_path,
        release_date,
        title,
        vote_average,
        overview,
        releases : { countries: [ { certification } ] },
        videos: { results : videos },
        casts : { cast, crew },
        runtime,
        genres
       } = movie  

       let releaseDate = release_date.split("-").slice(0,1).join("");
       let voteAverage = vote_average.toFixed(1);
       let genresAsString = genres.map( ({ name }) => name ).join(",");
       let castList = [];
       let directors = [];

       crew.forEach( ( { name }, index) => {
         index >= 10 ? castList : castList.push(name);
       });

       castList = castList.join(", ");

       crew.filter( ({ job, name }) => job.toLowerCase() == "director" ? directors.push(name) : null).join(",");
       directors = directors.join(", ");

       function videoList(videos) {
         return videos.filter( ({ type,site }) => type == "Teaser" || type == "Trailer" && site == "YouTube" );
      }


    document.querySelector(".details-movie__poster").innerHTML =  `
      <img class="details-movie__poster__image" src="${imageBaseUrl}${backdrop_path || poster_path}" alt="${title}">
    `;  

    document.querySelector(".details-movie__content").innerHTML = `
    <p class="details-movie__caption  fs-600 fw-bold capitalize">${title}</p>
    <p class="details-movie__overview">${overview}</p>
        <div class=" rating-container flex flex-align-center">
            <img class="rating-image " src="../assets/details/star.png" alt="Star Rate">
            <p class="rating-number fw-bold">${voteAverage}</p> 
            <p class="running-time fw-bold">${runtime}m</p>
            <p class="year fw-bold">${releaseDate}</p>
            <p class="certification fw-bold theme-bg-black theme-color-white">${certification}</p>    
        </div>
    <div class="genres">
        <p class="capitalize">${genresAsString}</p>
    </div>
    <p class="starring">${castList}</p>
    <p class="directed-by capitalize">${directors}</p>
    `;

   for ( const { key,name } of videoList(videos) ) {
    document.querySelector(".slider-control__inner").innerHTML += `
    <a href="details.html" class="card details-movie__card pointer theme-white flex flex-column" trailer-clips-card>
    <iframe src="https://www.youtube.com/embed/${key}" title="${name}" style="width: 100%">
    </iframe> 
    <a>
    `;
  }

};

fetch(similarMoviesUrl)
    .then(response => response.json()) 
    .then(data => createCard(data))
    .then( () => {
        document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", getMovieId)
        cardWidth =  card.clientWidth; 
        card.style.height = "300px";
      })
    } ).then( () => {
        document.querySelectorAll("[meta-item-caption]").forEach( caption => {
        caption.style.width = cardWidth + "px";
        caption.classList.add("active");
      } )
    } )

  function createCard( { results } ) {

    if (results.length == 0) {
      let container = document.querySelector(".may-also-like");
      container.style.display = "none";
    }

    results.forEach( result => {
       if (result.backdrop_path == null && result.poster_path == null) {
        mayAlsoLike.innerHTML += ``;
       } else {
        mayAlsoLike.innerHTML += returnCards(...getArrayResult(imageBaseUrl, result));;
       }

      }
       
    )} 