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
  };
  weather: { description: string; icon: string }[];
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
        </div>
      )}
    </div>
  );
}

export default App;
