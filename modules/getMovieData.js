'use strict';

const axios = require('axios');
const cache = require('./cache');

class MovieData {
  constructor(obj) {
    this.title = obj.title;
    this.description = obj.overview;
    this.avg = obj.vote_average;
    this.total_likes = obj.vote_count;
    this.image = obj.poster_path;
    this.backdrop = obj.backdrop_path;
    this.popularity = obj.popularity;
    this.released = obj.release_date;
  }
}

function getMovieData(req, res, next) {
  const { city } = req.query;
  const key = 'movies in' + city;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API}&query=${city}&append_to_response=videos,images`;

  cache[key] && (Date.now() - cache[key].timestamp < 2629746 )
    ? res.status(200).send(cache[key])
    : axios.get(url)
      .then(res => res.data.results.filter(v => v.backdrop_path || v.poster_path).map(n => new MovieData(n)).slice(0, 4))
      .then(formattedDataM => {
        cache[key] = {};
        cache[key] = {
          data: formattedDataM,
          timestamp: Date.now()
        };
        console.log('from cache',cache[key]);
        res.status(200).send({
          data: formattedDataM,
          timestamp: cache[key].timestamp
        });
      })
      .catch(err => next(err));
}

module.exports = getMovieData;
