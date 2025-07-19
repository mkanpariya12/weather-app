import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CitySearch from "./CitySearch";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

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

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCitySearch = async (city: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const apiKey = "c015521447d008834169fdf44b512532"; // Replace with your OpenWeatherMap API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error("City not found or API error");
      }
      const data = await response.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <CitySearch onSearch={handleCitySearch} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <h2>{weather.name}</h2>
          <p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              style={{ verticalAlign: "middle" }}
            />
            {weather.weather[0].description}
          </p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Feels like: {weather.main.feels_like}°C</p>
          <p>
            Min: {weather.main.temp_min}°C / Max: {weather.main.temp_max}°C
          </p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind speed: {weather.wind.speed} m/s</p>
          <hr style={{ margin: "16px 0" }} />
          <strong>Outfit Recommendation:</strong>
          <p>{getOutfitRecommendation(weather)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
