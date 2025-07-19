import React from "react";
import CitySearch from "./CitySearch";
import { WeatherProvider, useWeather } from "./WeatherContext";
import type { WeatherData } from "./WeatherContext";

function getOutfitRecommendation(weather: WeatherData): string {
  const temp = weather.main.temp;
  const condition = weather.weather[0].main.toLowerCase();
  if (
    condition.includes("rain") ||
    condition.includes("drizzle") ||
    condition.includes("thunderstorm")
  ) {
    return "Take an umbrella and wear waterproof shoes.";
  }
  if (condition.includes("snow")) {
    return "Wear a warm coat, gloves, and boots.";
  }
  if (temp < 5) {
    return "Wear a heavy jacket, hat, and gloves.";
  }
  if (temp < 15) {
    return "Wear a light jacket or sweater.";
  }
  if (condition.includes("clear")) {
    return "Sunglasses suggested! Dress comfortably.";
  }
  if (temp > 28) {
    return "Wear light, breathable clothes and stay hydrated.";
  }
  if (condition.includes("cloud")) {
    return "It might be cool, consider a light layer.";
  }
  return "Dress comfortably for the weather.";
}

function AppContent() {
  const { weather, loading, error, history, searchCity } = useWeather();
  return (
    <div className="App">
      <CitySearch onSearch={searchCity} />
      {history.length > 0 && (
        <div className="recent-searches">
          <strong>Recent Searches:</strong>
          <ul>
            {history.map((city, idx) => (
              <li key={city + idx}>
                <button
                  className="history-btn"
                  onClick={() => searchCity(city)}
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Feels like: {weather.main.feels_like}°C</p>
          <p>
            Min: {weather.main.temp_min}°C / Max: {weather.main.temp_max}°C
          </p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind speed: {weather.wind.speed} m/s</p>
          <div className="outfit-title">Outfit Recommendation:</div>
          <div className="outfit-recommendation">
            {getOutfitRecommendation(weather)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  );
}
