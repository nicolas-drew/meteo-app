import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Profile.css";
import { FaHeart, FaTrash, FaEye, FaUser, FaCog } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { userAPI } from "../services/api";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteWeathers, setFavoriteWeathers] = useState({});
  const [loading, setLoading] = useState(true);
  const [newCity, setNewCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("favorites");

  // Rediriger si pas connecté
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoritesWeather();
    }
  }, [favorites]);

  const loadFavorites = async () => {
    try {
      const data = await userAPI.getFavoriteCities();
      setFavorites(data.favoriteCities || []);
    } catch (error) {
      console.error("Erreur chargement favoris:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoritesWeather = async () => {
    const weatherPromises = favorites.map(async (city) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city.cityName
          )}&appid=${API_KEY}&units=metric&lang=fr`
        );
        if (response.ok) {
          const data = await response.json();
          return { city: city.cityName, data };
        }
      } catch (error) {
        console.error(`Erreur météo pour ${city.cityName}:`, error);
      }
      return { city: city.cityName, data: null };
    });

    const results = await Promise.all(weatherPromises);
    const weatherData = {};
    results.forEach(({ city, data }) => {
      weatherData[city] = data;
    });
    setFavoriteWeathers(weatherData);
  };

  const removeFavorite = async (cityId) => {
    try {
      const data = await userAPI.removeFavoriteCity(cityId);
      setFavorites(data.favoriteCities);

      // Supprimer aussi les données météo
      const cityToRemove = favorites.find((fav) => fav._id === cityId);
      if (cityToRemove) {
        const newWeatherData = { ...favoriteWeathers };
        delete newWeatherData[cityToRemove.cityName];
        setFavoriteWeathers(newWeatherData);
      }
    } catch (error) {
      console.error("Erreur suppression favori:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const addFavorite = async (cityName) => {
    try {
      // Obtenir les coordonnées de la ville
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          cityName
        )}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();

      const coordinates =
        geoData.length > 0
          ? { lat: geoData[0].lat, lon: geoData[0].lon }
          : { lat: 0, lon: 0 };

      const data = await userAPI.addFavoriteCity({
        cityName,
        coordinates,
      });

      setFavorites(data.favoriteCities);
      setNewCity("");
      setShowSuggestions(false);
    } catch (error) {
      console.error("Erreur ajout favori:", error);
      alert(error.message || "Erreur lors de l'ajout");
    }
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
    const dayIconCode = iconCode.replace("n", "d");
    return `https://openweathermap.org/img/wn/${dayIconCode}@2x.png`;
  };

  const updatePreference = async (key, value) => {
    try {
      const preferences = { [key]: value };
      await userAPI.updatePreferences(preferences);

      // Mettre à jour le user dans le context
      updateUser({
        preferences: {
          ...user.preferences,
          [key]: value,
        },
      });
    } catch (error) {
      console.error("Erreur mise à jour préférence:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  if (!isAuthenticated) {
    return null; // ou un loader
  }

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
            <p>{user?.email}</p>
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
                    const weatherData = favoriteWeathers[city.cityName];
                    return (
                      <div key={city._id || idx} className="favorite-card">
                        <div className="card-header">
                          <h3>{city.cityName}</h3>
                          <button
                            className="remove-btn"
                            onClick={() => removeFavorite(city._id)}
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
                            navigate(
                              `/weather/${encodeURIComponent(city.cityName)}`
                            )
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
                    value={user?.preferences?.theme || "auto"}
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
                    value={user?.preferences?.units || "metric"}
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
                    value={user?.email || ""}
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
