'use strict';

require('dotenv').config();
const PORT = process.env.PORT;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors());

class WeatherData {
  constructor(obj) {
    this.dateTime = obj.datetime;
    this.highTemp = obj.max_temp;
    this.lowTemp = obj.low_temp;
    this.currentTemp = obj.temp;
    this.weather = {
      description: obj.weather.description,
      icon: obj.weather.icon
    };
  }
}

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

async function getWeatherData(req, res, next) {
  try {
    const { lat, lon } = req.query;

    const url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API}&lat=${lat}&lon=${lon}&days=7&unit=I`;
    const weather = await axios.get(url);

    const formattedData = weather.data.data.map(n => new WeatherData(n));
    res.status(200).send(formattedData);
  }
  catch (error) {
    // res.status(500).send(error.message);
    next(error);
  }
}

async function getMovieData(req, res, next) {
  try {
    const {city} = req.query;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API}&query=${city}&append_to_response=videos,images`;

    const movies = await axios.get(url);
    const formattedData = movies.data.results.map(n => new MovieData(n)).slice(0,4);

    res.status(200).send(formattedData);
  } catch(error) {
    // res.status(500).send(error.message);
    next(error);
  }
}

app.get('/', (req,res) => {
  res.status(200).send('Hey you got it working');
});

app.get('/weather', getWeatherData);

app.get('/movies', getMovieData);

app.use((error,req,res) => {
  res.status(500).send(error.message);
});

app.get('*', (req,res) => {
  res.status(400).send('Oh no! Something went wrong.');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
