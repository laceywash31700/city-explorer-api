'use strict';

const axios = require('axios');

class MovieData {
  constructor(obj) {
    this.title = obj.title;
    this.description = obj.overview;
    this.avg_likes = obj.vote_average;
    this.total_likes = obj.vote_count;
    this.image = obj.poster_path;
    this.popularity = obj.popularity;
    this.released = obj.release_date;
  }
}

function getMovieData (req, res, next) {
  const {city} = req.query;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API}&query=${city}&append_to_response=videos,images`;
  axios.get(url)
    .then(res => res.data.results.map(n => new MovieData(n)).slice(0,4))
    .then(formattedData => res.status(200).send(formattedData))
    .catch(err => next(err));
}

module.exports = getMovieData;
