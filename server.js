'use strict';

require('dotenv').config();

const PORT = process.env.PORT;
const express = require('express');
const cors = require('cors');
const app = express();
const getWeatherData = require('./modules/getWeatherData');
const getMovieData = require('./modules/getMovieData');

app.use(cors());

app.get('/', (req,res) => {
  res.status(200).send('Hey you got it working');
});

app.get('/weather', getWeatherData);

app.get('/movies', getMovieData);

app.use((err,req,res) => {
  res.status(500).send(err.message);
});

app.get('*', (req,res) => {
  res.status(400).send('Oh no! Something went wrong.');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
