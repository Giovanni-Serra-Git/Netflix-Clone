import { apiKey,imageBaseUrl } from "../app/api.js";
import { setGenreId, genreMoviesList, getMovieId, returnCards, getArrayResult, getCardWidth } from "../app/global.js";

let inputSearchOpen = document.querySelector("[search-icon]");
let containerResults = document.querySelector("[container-results]");
let searchMovies = document.querySelector("[search-movies]");
let input = document.querySelector("[input-search]");
let inputSearchClose = document.querySelector("[input-search-close]");
let openOverlay = document.querySelector("[hamburger-menu-open]");
let overlay = document.querySelector("[overlay]");
let closeOverlay = document.querySelector("[hamburger-menu-close]");
let currentPage = 1;
let cardWidth;
let totalPages;
let value;


inputSearchOpen.addEventListener("click", (e) => { 
    e.target.style.display = "none";
    searchMovies.classList.add("active");
});

inputSearchClose.addEventListener("click", () => {
    if (input.value != "") input.value = "";
    inputSearchOpen.style.display = "block";
    searchMovies.classList.remove("active");
    if (containerResults.classList.contains("active")) {
        currentPage = 1;
        let allResultsMovie = document.querySelector("[all-results-movies]");
        allResultsMovie.innerHTML = "";
        containerResults.classList.remove("active");
        if (document.querySelector("[load-more]")) document.querySelector("[load-more]").remove();
    } else { null }
});

openOverlay.addEventListener("click", () => {
    openOverlay.style.display = "none";
    closeOverlay.classList.add("active");
    overlay.classList.add("active");
})


closeOverlay.addEventListener("click", () => {
    closeOverlay.classList.remove("active");
    openOverlay.style.display = "block";
    overlay.classList.remove("active");
})


function createCard({ results, total_pages }) {


       let homePageSection = document.querySelectorAll("[parent-slider-home-page]");

       let home;

       if (homePageSection.length != 0) { home = "homepage" };

        containerResults.classList.add("active");
        let allResultsMovie = document.querySelector("[all-results-movies]");
        totalPages = total_pages;
        let arr = [];

        results.forEach(result => {

            allResultsMovie.innerHTML += returnCards(...getArrayResult(imageBaseUrl, result), home);
        })

}


function loadPages(e) {

    let loadMore = document.querySelector("[load-more]");
    loadMore != null ? loadMore.remove() : null;

    value = e.target.value;
    let searchMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${value}&page=1&include_adult=false`
    fetch(searchMovieUrl)
    .then(response => response.json())
    .then((data) => createCard(data))
    .then( () => { getCardWidth("[all-results-movies]") } )
    .then( () => {
        containerResults.innerHTML += `
        <button class="load-more flex flex-align-center capitalize pointer fs-100 fw-bold theme-color-white theme-bg-primary" load-more>
            load more
        </button>`;
        document.querySelector("[load-more]").addEventListener("click", (e) => {
            
            if (currentPage != totalPages)  {
                e.target.classList.add("loading");
                setTimeout( () => {
                    currentPage++;
                    searchMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${value}&page=${currentPage}&include_adult=false`
                    e.target.classList.remove("loading");
                    fetch(searchMovieUrl)
                    .then( response => response.json() )
                    .then( (data) => createCard(data) )
                    .then( () => {      
                        getCardWidth("[all-results-movies]")     
                        document.querySelectorAll(".card").forEach(card => card.addEventListener("click", getMovieId));
                } );
            
                return currentPage == totalPages ?  e.target.remove() : null;
            
                }, 2000 )
            }
            })
    } )  
    .then( () => {
        document.querySelectorAll("[meta-item-card]").forEach(card => {
            card.addEventListener("click", (e) => {
                getMovieId(e);                
            });
           })
    } ) 
}

if (searchMovies != null || searchMovies != undefined) {
    searchMovies.addEventListener("keyup", (e) => {
        if (e.key == "Enter" && e.target.value == "") return
        if (e.key == "Enter" && e.target.value != "") {
            let allResultsMovie = document.querySelector("[all-results-movies]");
            let titleMovie = document.querySelector("[result-title-movie]");
            let value = document.querySelector("[input-search]").value;
            titleMovie.innerHTML = `All ${value} Movies`;
            if (allResultsMovie.innerHTML != "") {
                currentPage = 1;
                allResultsMovie.innerHTML = "";
                loadPages(e);
            } else {
                loadPages(e);
            }
    
        }
    })
    
}





const genreListUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

function setGenreList({ genres }) { 
    const genreMovies = document.querySelector("[genre-movies]");
    for ( const {id,name} of genres ) {

        genreMoviesList[id] = name;

        genreMovies.innerHTML += `
            <li genre-list genre-id="${id}" genre-id="with_genres='${id}'" genre-name="${name}">
                <a href="../html/all-genre-movies.html"  target="_blank">${name}</a>
            </li>
        `;
    }

};

function getLanguages() {


    const languagesList = document.querySelector("[languages]");
    const languagesArray = [
        ["en", "English"],
        ["it", "Italian"],
        ["de", "German"],
        ["hi", "Indian"],
    ]; 
    const languagesMap = new Map();
    languagesArray.forEach( languages => {
        const [idLanguage,language] = languages;
        languagesMap.set(idLanguage,language);
        languagesList.innerHTML += `
        <li class="capitalize" language>
            <a href="../html/all-movies.html"  language-id="${idLanguage}" language-string="${language}" language-link>${language}</a>
        </li>

    `;
    } );

    languagesList.innerHTML += `
    <div class="flex flex-column">
        <img class="logo-tmdb" src="../assets/overlay/tmdb-logo.png" alt="Logo TMDB">
    </div>
`;

}


fetch(genreListUrl)
    .then( response => response.json())
    .then( data => setGenreList(data) )
    .then( () => {
        document.querySelectorAll("[genre-list]").forEach(list => {
            list.addEventListener("click", setGenreId);
        })
    } )
getLanguages()



document.querySelectorAll("[language-link]").forEach(language => {
    let languageId = language.getAttribute("language-id");
    let languageString = language.getAttribute("language-string");
    language.addEventListener("click", (e) => {
        window.localStorage.setItem("language",`with_original_language=${languageId}`);
        window.localStorage.setItem("language-string",languageString);
    })
})
