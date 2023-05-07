'use strict';

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const weather = require('./data/weather.json');
const app = express();
app.use(cors());

class WeatherData {
  constructor(obj) {
    this.city_name = obj.city_name;
    this.dateTime = obj.datetime;
    this.highTemp = obj.data.high_temp;
    this.lowTemp = obj.data.low_temp;
    this.currentTemp = obj.data.temp;
    this.weather = {
      description: obj.weather.description,
      icon: obj.weather.icon,
      code: obj.weather.code
    };
  }
}


app.get('/', (request, response) => {
  response.status(200).send('Hey you got it working');
});


app.get('/weather', (request, response) => {
  const lat = parseFloat(request.query.lat);
  const lon = parseFloat(request.query.lon);

  try { 
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new Error('Invalid lat and/or lon value');
    }
    const queryData = lat && lon ? weather.filter(v => v.lon === lon && v.lat === lat).map(v => new WeatherData(v) ) : null;
    if (!queryData) {
      throw new Error('No weather data found for the specified latitude and longitude');
    } response.status(200).send(queryData);
  }
  catch(error){
    console.error(error);
    response.status(500).send(error.message);
  }
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
