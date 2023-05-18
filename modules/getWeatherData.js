'use strict';

const axios = require('axios');
const cache = require('./cache');

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
  const { lat, lon } = req.query;
  const key = 'location' + lat + lon;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API}&lat=${lat}&lon=${lon}&days=7&unit=I`;


  cache[key] && (Date.now() - cache[key].timestamp < 604800)
    ? res.status(200).send(cache[key])
    : axios.get(url)
      .then(res => res.data.data.map(n => new WeatherData(n)))
      .then(formattedDataW => {
        cache[key] = {};
        cache[key] = {
          data: formattedDataW,
          timestamp: Date.now()
        };
        console.log('from cache',cache[key]);
        res.status(200).send({
          data: formattedDataW,
          timestamp: cache[key].timestamp
        });
      })
      .catch(err => next(err));
}

module.exports = getWeatherData;
