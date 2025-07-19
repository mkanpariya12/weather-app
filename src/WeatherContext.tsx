import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: { description: string; icon: string; main: string }[];
  wind: { speed: number };
}

interface WeatherContextType {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  history: string[];
  searchCity: (city: string) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const searchCity = async (city: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const apiKey = "c015521447d008834169fdf44b512532";
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
      setHistory((prev) => {
        const newHistory = [
          city,
          ...prev.filter((c) => c.toLowerCase() !== city.toLowerCase()),
        ];
        return newHistory.slice(0, 5);
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherContext.Provider
      value={{ weather, loading, error, history, searchCity }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context)
    throw new Error("useWeather must be used within a WeatherProvider");
  return context;
};
