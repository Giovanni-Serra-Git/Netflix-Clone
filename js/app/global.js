import { apiKey, imageBaseUrl } from "./api.js";

export function getMovieId(e) {
    let item;
    if (e.target.closest(".card") != null) {
        item = ".card";
    } else if (e.target.closest("meta-item-card")  != null) {
        item = "[meta-item-card]";
    } else if (e.target.closest("a") != null) {
        item = "a";
    }

    let id = e.target.closest(item).getAttribute("movie-id");
    window.localStorage.setItem("idMovie", id); 
}

export function getCardWidth(element) {
    let firstCard = document.querySelector(".card").clientWidth;
    let container = document.querySelector(element);
    container.style.gridAutoRows = firstCard + "px";
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", getMovieId)
        let cardWidth =  document.querySelectorAll("[meta-item-card]")[0].clientWidth;
        document.querySelectorAll("[meta-item-card] .caption").forEach( item => {
            item.style.width = cardWidth + "px";
            item.classList.add("active");
        } )
    })
}


export function getArrayResult(imageBaseUrl, result) { 
    const {
        backdrop_path,
        poster_path,
        release_date,
        title,
        vote_average,
        genre_ids,
        id,
    } = result;

    let releaseDate = release_date.split("-").slice(0,1).join(""); 
    let voteAverage = vote_average.toFixed(1);

    let resultArray = [
        imageBaseUrl,
        backdrop_path,
        poster_path,
        title,
        genre_ids,
        id,
        voteAverage,
        releaseDate,
    ];

    return resultArray;

}

export function setGenreId(e) {
    let genreId = e.target.closest("li").getAttribute("genre-id");
    let genreName = e.target.closest("li").getAttribute("genre-name");
    window.localStorage.setItem("genre_id", `with_genres=${genreId}`);
    window.localStorage.setItem("genre-name", genreName);
}

export const genreMoviesList = {
    asString(genreListId) {
        let genreListString = [];
        for (const genreid of genreListId) {
           return this[genreid] && genreListString.push(this[genreid]);
        }
    }
}

export function returnCards(imageBaseUrl,backdrop_path,poster_path,title,genre_ids,id,voteAverage,releaseDate, homePage) {

    let href;

    if (homePage == "homepage") {
        href = "html/details.html"
    } else { href = "details.html" };

    return `
    <a href="${href}" class="card pointer theme-white flex flex-column" meta-item-card genre-id="${genre_ids}" movie-id="${id}">
    <img src="${imageBaseUrl}${backdrop_path || poster_path}" alt="${title}">
     <p class="caption fs-100 fw-bold capitalize" meta-item-caption>${title}</p>
        <div class="more-details flex flex-align-center">
         <p class="year fw-bold fs-100">${releaseDate}</p>
            <div class=" rating-container flex flex-center">
                <img class="rating-image " src="../assets/details/star.png" alt="Star Rate">
                <p class="rating-number fw-bold fs-100">${voteAverage}</p> 
            </div>
         </div>
    </a>
    `
}



// Slider

export function loadMoreSliderItem(path,parent,page, classElement, slider) { 
    if (parent.classList.contains("meta-item")) {
        let pathUrl = `https://api.themoviedb.org/3/${path}?api_key=${apiKey}&language=en-US&page=${page}`; 
        let sliderWrapperHomePage = parent.querySelector("[slider-wrapper-home-page]");
        window.localStorage.setItem("pathUrl", pathUrl);

        fetch(pathUrl)
        .then(response => response.json())
        .then(data => movieListHomePage(data,sliderWrapperHomePage))
        .then( () => getCardWidth("[slider-wrapper-home-page]" ) )
        .then( () => {
            classElement.parent = classElement.element.target.closest("div[parent-slider]");
            classElement.parentClassList = classElement.element.target.closest("div[parent-slider]").classList[0];
            classElement.prova = classElement.element.target.closest("div[parent-slider]");
            classElement.slider = classElement.element.target.closest("div[parent-slider]").querySelector("[slider-wrapper]");
            classElement.sliderOffsetLeft = slider.getBoundingClientRect().left;
            classElement.sliderCards = Array.from(slider.children);
            classElement.lastCard = classElement.sliderCards[classElement.sliderCards.length - 1];
            classElement.sliderWidth = slider.offsetWidth;
            classElement.sliderTransformValue = window.getComputedStyle(slider).getPropertyValue("transform");
            classElement.sliderGapValue = window.getComputedStyle(slider).getPropertyValue("gap").split("").slice(0,-2).join("");
            classElement.cardsLength = slider.children.length;
            classElement.cardWidth = Number(slider.children[0].offsetWidth + Number(classElement.sliderGapValue));
            classElement.sliderTransformValue = Math.floor(Number(new WebKitCSSMatrix(classElement.sliderTransformValue).e));
        } )
        
    }
}


function movieListHomePage( { results }, sliderWrapperHomePage ) {
    results.forEach(result => {
        sliderWrapperHomePage.innerHTML +=  returnCards(...getArrayResult(imageBaseUrl, result));
        document.querySelectorAll("[meta-item-card]").forEach(card => {
            card.addEventListener("click", getMovieId);
        })
    })
}