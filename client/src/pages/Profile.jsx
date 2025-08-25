import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Profile.css";
import { FaHeart, FaTrash, FaEye, FaUser, FaCog, FaPlus } from "react-icons/fa";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const Profile = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [favoriteWeathers, setFavoriteWeathers] = useState({});
  const [loading, setLoading] = useState(true);
  const [newCity, setNewCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("favorites");

  // Données utilisateur simulées (à remplacer par l'API)
  const [userProfile, setUserProfile] = useState({
    email: "user@example.com",
    preferences: {
      theme: "auto",
      units: "metric",
    },
  });

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoritesWeather();
    }
  }, [favorites]);

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem("favoriteCities");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    setLoading(false);
  };

  const fetchFavoritesWeather = async () => {
    const weatherPromises = favorites.map(async (city) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&appid=${API_KEY}&units=metric&lang=fr`
        );
        if (response.ok) {
          const data = await response.json();
          return { city, data };
        }
      } catch (error) {
        console.error(`Erreur météo pour ${city}:`, error);
      }
      return { city, data: null };
    });

    const results = await Promise.all(weatherPromises);
    const weatherData = {};
    results.forEach(({ city, data }) => {
      weatherData[city] = data;
    });
    setFavoriteWeathers(weatherData);
  };

  const removeFavorite = (cityName) => {
    const newFavorites = favorites.filter((fav) => fav !== cityName);
    setFavorites(newFavorites);
    localStorage.setItem("favoriteCities", JSON.stringify(newFavorites));

    // Supprimer aussi les données météo
    const newWeatherData = { ...favoriteWeathers };
    delete newWeatherData[cityName];
    setFavoriteWeathers(newWeatherData);
  };

  const addFavorite = (cityName) => {
    if (!favorites.includes(cityName)) {
      const newFavorites = [...favorites, cityName];
      setFavorites(newFavorites);
      localStorage.setItem("favoriteCities", JSON.stringify(newFavorites));
    }
    setNewCity("");
    setShowSuggestions(false);
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setNewCity(value);

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
        console.error("Erreur suggestions:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const updatePreference = (key, value) => {
    setUserProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
    // Ici tu pourras faire l'appel API pour sauvegarder
    console.log("Préférence mise à jour:", key, value);
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <div className="loading">Chargement...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              <FaUser />
            </div>
            <h1>Mon Profil</h1>
            <p>{userProfile.email}</p>
          </div>

          <div className="profile-tabs">
            <button
              className={`tab ${activeTab === "favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              <FaHeart /> Favoris
            </button>
            <button
              className={`tab ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <FaCog /> Préférences
            </button>
          </div>

          {activeTab === "favorites" && (
            <div className="favorites-tab">
              <div className="add-favorite-section">
                <h3>Ajouter une ville favorite</h3>
                <div className="add-favorite-form">
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Nom de la ville..."
                      value={newCity}
                      onChange={handleInputChange}
                      onFocus={() =>
                        newCity.length > 2 &&
                        suggestions.length > 0 &&
                        setShowSuggestions(true)
                      }
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 150)
                      }
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="suggestions-dropdown">
                        {suggestions.map((suggestion, idx) => (
                          <li
                            key={idx}
                            onMouseDown={() => addFavorite(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="favorites-grid">
                {favorites.length === 0 ? (
                  <div className="no-favorites">
                    <FaHeart className="empty-heart" />
                    <h3>Aucune ville favorite</h3>
                    <p>
                      Ajoutez vos villes préférées pour suivre leur météo
                      facilement
                    </p>
                  </div>
                ) : (
                  favorites.map((city, idx) => {
                    const weatherData = favoriteWeathers[city];
                    return (
                      <div key={idx} className="favorite-card">
                        <div className="card-header">
                          <h3>{city}</h3>
                          <button
                            className="remove-btn"
                            onClick={() => removeFavorite(city)}
                            title="Supprimer des favoris"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        {weatherData ? (
                          <div className="weather-info">
                            <div className="weather-main">
                              <img
                                src={getWeatherIcon(
                                  weatherData.weather[0].icon
                                )}
                                alt={weatherData.weather[0].description}
                                className="weather-icon"
                              />
                              <div className="temp">
                                {Math.round(weatherData.main.temp)}°C
                              </div>
                            </div>
                            <div className="weather-description">
                              {weatherData.weather[0].description}
                            </div>
                            <div className="weather-details">
                              <span>
                                Ressenti:{" "}
                                {Math.round(weatherData.main.feels_like)}°C
                              </span>
                              <span>
                                Humidité: {weatherData.main.humidity}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="weather-loading">
                            <p>Chargement...</p>
                          </div>
                        )}

                        <button
                          className="view-detail-btn"
                          onClick={() =>
                            navigate(`/weather/${encodeURIComponent(city)}`)
                          }
                        >
                          <FaEye /> Voir détail
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="settings-tab">
              <div className="settings-section">
                <h3>Préférences d'affichage</h3>

                <div className="setting-item">
                  <label>Thème</label>
                  <select
                    value={userProfile.preferences.theme}
                    onChange={(e) => updatePreference("theme", e.target.value)}
                  >
                    <option value="auto">Automatique</option>
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Unités de température</label>
                  <select
                    value={userProfile.preferences.units}
                    onChange={(e) => updatePreference("units", e.target.value)}
                  >
                    <option value="metric">Celsius (°C)</option>
                    <option value="imperial">Fahrenheit (°F)</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Compte</h3>

                <div className="setting-item">
                  <label>Email</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    readOnly
                    className="readonly-input"
                  />
                </div>

                <div className="account-actions">
                  <button className="btn-secondary">
                    Changer le mot de passe
                  </button>
                  <button className="btn-danger">Supprimer le compte</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
