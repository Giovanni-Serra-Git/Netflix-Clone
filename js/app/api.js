export const apiKey = "6d768187fc388a2008a76040f867388b";
export const imageBaseUrl = "https://image.tmdb.org/t/p/original/";
export function addEventOnElements(elements, eventType, callBack) {
    for (const element of elements) {
        element.addEventListener(eventType, callBack);
    }
};

export function fetchData (url, callBack, optionalParameters) {
    fetch(url)
    .then(response => response.json())
    .then(data => callBack(data, optionalParameters));
}

export function getMovieList(key,value) { console.log(key,value)}