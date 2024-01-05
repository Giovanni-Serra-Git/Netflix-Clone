export const apiKey = "b7eb82e48e907c25cd1f68e45e6d5f1e";
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
