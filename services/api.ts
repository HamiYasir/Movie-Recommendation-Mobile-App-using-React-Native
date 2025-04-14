// Configuring request
export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
    }
}

// Fetch the request from 'https://api.themoviedb.org/3/discover/movie'
export const fetchMovies = async ({
  query
}: {
    query: string
}) : Promise<Movie[]> => {
    const endpoint = query
        // If there is a query
        ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        // If there is none, just display popular movies
        :`${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, {
        method: "GET",
        headers: TMDB_CONFIG.headers,
    });

    // If response returns error
    if(!response.ok) {
        throw new Error(`Failed ti fetch movies: ${response.statusText}`);
    }

    // If successful
    const data = await response.json();
    return data.results;
};

// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//     method: 'GET',
//     headers: {
//         accept: 'application/json',
//         Authorization: 'Bearer 
//     }
// };
//
// fetch(url, options)
//     .then(res => res.json())
//     .then(json => console.log(json))
//     .catch(err => console.error(err));
