const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiN2ViODJlNDhlOTA3YzI1Y2QxZjY4ZTQ1ZTZkNWYxZSIsInN1YiI6IjYzZmNiMjk3OTZlMzBiMDA4N2Y4Y2E2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TWb0nVGvmtWUeyVUtrkH_2cw8-TnwD-6hptVYTbEz0c'
    }
  };
  
  fetch('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
