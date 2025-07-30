import "../styles/Hero.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const Hero = () => {
  const [city, setCity] = useState("");
  const [loadinglocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    handleLocationClick();
  }, []);

  const handleLocationClick = async () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const userCity =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            "";

          setCity(userCity);

          const localHour = new Date().getHours();
          if (localHour >= 20 || localHour < 7) {
            document.body.className = "dark";
          } else document.body.className = "light";
          setLoadingLocation(false);
        },
        (error) => {
          alert("Impossible d'obtenir la position : " + error.message);
          setLoadingLoc(false);
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
      setLoadingLoc(false);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 2) {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          value
        )}&limit=5&appid=${API_KEY}`
      );

      const data = await res.json();
      setSuggestions(
        data.map(
          (cityObj) =>
            `${cityObj.name}${cityObj.state ? ", " + cityObj.state : ""}, ${
              cityObj.country
            }`
        )
      );
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      navigate(`/weather/${encodeURIComponent(city.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setShowSuggestions(false);
    // navigate(`/weather/${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="hero">
      <h1>Consulte la météo</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <button
          type="button"
          className="location-button"
          onClick={handleLocationClick}
          disabled={loadinglocation}
          title="Utiliser ma position"
        >
          <FaLocationDot className="icon-location" />
        </button>
        <input
          type="text"
          placeholder="Saisis ta ville"
          value={city}
          onChange={handleInputChange}
          onFocus={() =>
            city.length > 2 &&
            suggestions.length > 0 &&
            setShowSuggestions(true)
          }
          onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggest, idx) => (
              <li key={idx} onMouseDown={() => handleSuggestionClick(suggest)}>
                {suggest}
              </li>
            ))}
          </ul>
        )}
        <button type="submit">
          <FaSearch />
        </button>
      </form>
    </div>
  );
};

export default Hero;
