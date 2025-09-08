import { useState, useEffect } from "react";
import "../styles/WeatherMap.css";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Popup,
  Marker,
} from "react-leaflet";
import { Link } from "react-router-dom";
import { IoMdArrowRoundForward } from "react-icons/io";

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const WeatherMap = () => {
  const [userPosition, setUserPosition] = useState([48.8566, 2.3522]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weatherLayer, setWeatherLayer] = useState("temp");

  const handleMapClick = async (latlng) => {
    setSelectedPosition([latlng.lat, latlng.lng]);
    setLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latlng.lat}&lon=${latlng.lng}&appid=${API_KEY}&units=metric&lang=fr`
      );

      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      }
    } catch (error) {
      console.error("Erreur météo:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherLayerUrl = (layer) => {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const layers = {
      temp: "temp_new",
      precipitation: "precipitation_new",
      clouds: "clouds_new",
      wind: "wind_new",
    };
    return `https://tile.openweathermap.org/map/${layers[layer]}/{z}/{x}/{y}.png?appid=${API_KEY}`;
  };

  return (
    <div className="weather-map-container">
      {selectedPosition && (
        <div className="weather-sidebar">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : weatherData ? (
            <div className="weather-info">
              <h2>{weatherData.name}</h2>
              <div className="temp">{Math.round(weatherData.main.temp)}°C</div>
              <div className="description">
                {weatherData.weather?.[0]?.description}
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather?.[0]?.icon?.replace(
                  "n",
                  "d"
                )}@2x.png`}
                alt={weatherData.weather?.[0]?.description || ""}
              />
              <div className="details">
                <p>Ressenti: {Math.round(weatherData.main.feels_like)}°C</p>
                <p>Humidité: {weatherData.main.humidity}%</p>
                <p>
                  Vent: {Math.round((weatherData.wind?.speed || 0) * 3.6)} km/h
                </p>
              </div>
              <Link
                to={`/weather/${encodeURIComponent(weatherData.name)}`}
                style={{ textDecoration: "none" }}
              >
                <button className="animated-button">
                  <IoMdArrowRoundForward className="arr-1" />
                  <span className="text">Live</span>
                  <IoMdArrowRoundForward className="arr-2" />
                </button>
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>
      )}

      <div className="layer-switcher">
        <button
          className={weatherLayer === "temp" ? "active" : ""}
          onClick={() => setWeatherLayer("temp")}
        >
          Température
        </button>
        <button
          className={weatherLayer === "precipitation" ? "active" : ""}
          onClick={() => setWeatherLayer("precipitation")}
        >
          Précipitations
        </button>
        <button
          className={weatherLayer === "clouds" ? "active" : ""}
          onClick={() => setWeatherLayer("clouds")}
        >
          Nuages
        </button>
        <button
          className={weatherLayer === "wind" ? "active" : ""}
          onClick={() => setWeatherLayer("wind")}
        >
          Vent
        </button>
      </div>

      <MapContainer
        center={userPosition}
        zoom={4}
        scrollWheelZoom={true}
        className="weather-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileLayer url={getWeatherLayerUrl(weatherLayer)} opacity={0.6} />
        {selectedPosition && (
          <Marker position={selectedPosition}>
            <Popup>
              {weatherData ? (
                <div>
                  <strong>{weatherData.name}</strong>
                  <br />
                  {Math.round(weatherData.main.temp)}°C -{" "}
                  {weatherData.weather?.[0]?.description}
                </div>
              ) : (
                "Chargement..."
              )}
            </Popup>
          </Marker>
        )}
        <MapClickHandler onMapClick={handleMapClick} />
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
