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
  const [hasAskedLocation, setHasAskedLocation] = useState(false);

  // Demander la localisation seulement la première fois
  useEffect(() => {
    const hasAskedLocationBefore = localStorage.getItem("hasAskedLocation");
    const savedCity = localStorage.getItem("userCity");

    if (!hasAskedLocationBefore) {
      // Première visite : demander la localisation
      handleLocationClick();
      localStorage.setItem("hasAskedLocation", "true");
    } else if (savedCity) {
      // Visites suivantes : utiliser la ville sauvegardée
      setCity(savedCity);
    }
  }, []);

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
          // Sauvegarder la ville dans localStorage
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
            // Marquer que l'utilisateur a refusé pour ne pas redemander
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
          data.map(
            (cityObj) =>
              `${cityObj.name}${cityObj.state ? ", " + cityObj.state : ""}, ${
                cityObj.country
              }`
          )
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
      // Sauvegarder la ville recherchée
      localStorage.setItem("userCity", city.trim());
      navigate(`/weather/${encodeURIComponent(city.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setShowSuggestions(false);
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
