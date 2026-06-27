const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function testWeather(city) {
  try {
    console.log("Searching for city:", city);
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;
    const geoData = await fetchJson(geoUrl);
    
    if (!geoData.results || geoData.results.length === 0) {
      console.log("City not found.");
      return;
    }
    const location = geoData.results[0];
    console.log(`Found: ${location.name}, ${location.admin1}, ${location.country} (Lat: ${location.latitude}, Lon: ${location.longitude})`);
    
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=America%2FSao_Paulo`;
    const weatherData = await fetchJson(weatherUrl);
    
    console.log("Weather Forecast:");
    const daily = weatherData.daily;
    for(let i=0; i<3; i++) {
        console.log(`Date: ${daily.time[i]} | Min: ${daily.temperature_2m_min[i]}°C | Max: ${daily.temperature_2m_max[i]}°C | Rain: ${daily.precipitation_sum[i]}mm (${daily.precipitation_probability_max[i]}% prob)`);
    }

  } catch(e) {
    console.error(e);
  }
}

testWeather("Mato Leitão");
