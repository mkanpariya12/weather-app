import React, { useState } from "react";

interface CitySearchProps {
  onSearch: (city: string) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "8px", marginBottom: "16px" }}
    >
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ flex: 1, padding: "8px" }}
      />
      <button type="submit" style={{ padding: "8px 16px" }}>
        Search
      </button>
    </form>
  );
};

export default CitySearch;
