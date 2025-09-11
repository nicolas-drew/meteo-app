import "../styles/Hero.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTemperature } from "../utils/temperature";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const Hero = () => {
  const [city, setCity] = useState("");
  const [loadinglocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasAskedLocation, setHasAskedLocation] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // Récupérer les préférences utilisateur
  const { user } = useAuth();
  const { formatTemperature, getUnitsForAPI } = useTemperature(user);

  // Demander la localisation seulement la première fois
  useEffect(() => {
    const hasAskedLocationBefore = localStorage.getItem("hasAskedLocation");
    const savedCity = localStorage.getItem("userCity");

    if (!hasAskedLocationBefore) {
      handleLocationClick();
      localStorage.setItem("hasAskedLocation", "true");
    } else if (savedCity) {
      setCity(savedCity);
      fetchWeatherData(savedCity);
    }
  }, []);

  // Recharger les données météo quand les préférences changent
  useEffect(() => {
    if (weatherData && user?.preferences?.units) {
      // Recharger les données avec les nouvelles unités
      if (selectedCity) {
        fetchWeatherData({ lat: selectedCity.lat, lon: selectedCity.lon });
      } else if (city) {
        fetchWeatherData(city);
      }
    }
  }, [user?.preferences?.units]);

  // Fonction pour récupérer les données météo
  const fetchWeatherData = async (cityArg) => {
    try {
      let currentResponse, forecastResponse;
      const units = getUnitsForAPI(); // Toujours 'metric' pour l'API

      if (typeof cityArg === "object" && cityArg?.lat && cityArg?.lon) {
        const { lat, lon } = cityArg;
        currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=fr`
        );
        forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=fr`
        );
      } else {
        const cityName = cityArg;
        if (!cityName || cityName.length < 2) {
          setWeatherData(null);
          return;
        }
        currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            cityName
          )}&appid=${API_KEY}&units=${units}&lang=fr`
        );
        forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            cityName
          )}&appid=${API_KEY}&units=${units}&lang=fr`
        );
      }

      if (currentResponse.ok && forecastResponse.ok) {
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        const dailyForecasts = groupForecastsByDay(forecastData.list);

        setWeatherData({
          current: currentData,
          forecast: dailyForecasts.slice(0, 5),
        });

        const country = currentData.sys?.country;
        const label = country
          ? `${currentData.name}, ${country}`
          : currentData.name;
        setCity(label);
        localStorage.setItem("userCity", label);
      } else {
        setWeatherData(null);
      }
    } catch (e) {
      console.error("Erreur météo:", e);
      setWeatherData(null);
    }
  };

  // Fonction pour grouper les prévisions par jour
  const groupForecastsByDay = (forecastList) => {
    const grouped = {};

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();

      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          date: date,
          items: [],
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          weather: item.weather[0],
        };
      }

      grouped[dayKey].items.push(item);
      grouped[dayKey].temp_min = Math.min(
        grouped[dayKey].temp_min,
        item.main.temp_min
      );
      grouped[dayKey].temp_max = Math.max(
        grouped[dayKey].temp_max,
        item.main.temp_max
      );
    });

    return Object.values(grouped);
  };

  // Déclencher la recherche météo quand la ville change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (city.length >= 2) {
        fetchWeatherData(city);
      } else {
        setWeatherData(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [city]);

  const handleLocationClick = async () => {
    if (loadinglocation) return;

    setLoadingLocation(true);

    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
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
          if (userCity) {
            localStorage.setItem("userCity", userCity);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de la ville:", error);
          alert("Erreur lors de la récupération de votre localisation");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Erreur géolocalisation:", error);
        let errorMessage = "Impossible d'obtenir la position";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "L'accès à la localisation a été refusé";
            localStorage.setItem("locationDenied", "true");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Les informations de localisation ne sont pas disponibles";
            break;
          case error.TIMEOUT:
            errorMessage = "La demande de localisation a expiré";
            break;
        }

        alert(errorMessage);
        setLoadingLocation(false);
      }
    );
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 2) {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            value
          )}&limit=5&appid=${API_KEY}`
        );

        const data = await res.json();
        setSuggestions(
          data.map((c) => ({
            name: c.name,
            state: c.state || "",
            country: c.country,
            lat: c.lat,
            lon: c.lon,
          }))
        );

        setShowSuggestions(true);
      } catch (error) {
        console.error("Erreur lors de la récupération des suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      localStorage.setItem("userCity", city.trim());
      navigate(`/weather/${encodeURIComponent(city.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const label = `${suggestion.name}${
      suggestion.state ? ", " + suggestion.state : ""
    }, ${suggestion.country}`;
    setCity(label);
    setSelectedCity(suggestion);
    setShowSuggestions(false);

    localStorage.setItem("selectedCity", JSON.stringify(suggestion));
    localStorage.setItem("userCity", label);

    fetchWeatherData({ lat: suggestion.lat, lon: suggestion.lon, label });
  };

  const formatDate = (date, isToday = false) => {
    if (isToday) return "Aujourd'hui";

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === tomorrow.toDateString()) {
      return "Demain";
    }

    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
    });
  };

  const getWeatherIcon = (iconCode) => {
    const dayIconCode = iconCode.replace("n", "d");
    return `https://openweathermap.org/img/wn/${dayIconCode}@2x.png`;
  };

  const handleTodayClick = () => {
    if (weatherData?.current) {
      const { name, sys, coord } = weatherData.current;
      const label = sys?.country ? `${name}, ${sys.country}` : name;
      navigate(
        `/weather/${encodeURIComponent(label)}?lat=${coord.lat}&lon=${
          coord.lon
        }`
      );
    }
  };

  return (
    <div className="hero">
      <h1>Consulte la météo</h1>
      <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : 0
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightIndex((prev) =>
                prev > 0 ? prev - 1 : suggestions.length - 1
              );
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (highlightIndex >= 0 && suggestions[highlightIndex]) {
                handleSuggestionClick(suggestions[highlightIndex]);
              }
            }
          }}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggest, idx) => (
              <li
                key={idx}
                className={highlightIndex === idx ? "highlighted" : ""}
                onMouseDown={() => handleSuggestionClick(suggest)}
              >
                {suggest.name}
                {suggest.state ? `, ${suggest.state}` : ""}, {suggest.country}
              </li>
            ))}
          </ul>
        )}
      </form>

      {weatherData && (
        <div className="weather-preview">
          <h2 className="city-title">
            {weatherData.current.name}
            {weatherData.current.sys?.country
              ? `, ${weatherData.current.sys.country}`
              : ""}
            {selectedCity?.state ? ` (${selectedCity.state})` : ""}
          </h2>

          <div className="forecast-container">
            {weatherData.forecast.map((day, index) => (
              <div
                key={index}
                className={`forecast-day ${index === 0 ? "today" : ""}`}
                onClick={index === 0 ? handleTodayClick : undefined}
              >
                <div className="day-name">
                  {formatDate(day.date, index === 0)}
                </div>
                <img
                  src={getWeatherIcon(day.weather.icon)}
                  alt={day.weather.description}
                  className="weather-icon"
                />
                <div className="temperature-range">
                  <span className="temp-max">
                    {formatTemperature(day.temp_max)}
                  </span>
                  <span className="temp-min">
                    {formatTemperature(day.temp_min)}
                  </span>
                </div>
                <div className="weather-desc">{day.weather.description}</div>
                {index === 0 && <div className="view-details">Voir détail</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
