'use strict';

const axios = require('axios');

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

function getWeatherData(req, res, next) {
  const {lat,lon} = req.query;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API}&lat=${lat}&lon=${lon}&days=7&unit=I`;
  axios.get(url)
    .then(res => res.data.data.map(n => new WeatherData(n)))
    .then(formattedData => res.status(200).send(formattedData))
    .catch(err => next(err));
}

module.exports = getWeatherData;
