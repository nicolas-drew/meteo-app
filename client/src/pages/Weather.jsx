import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Weather = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchWeatherData = async (cityName) => {
    try {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=fr`
      );

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=fr`
      );

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error("Ville non trouvée");
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      setWeatherData({
        current: currentData,
        forecast: forecastData.list.slice(0, 4),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  if (error) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <div className="error">
            <h2>Erreur : {error}</h2>
            <button onClick={() => navigate("/")}>Retour</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <main className="main-content weather-page">
        <WeatherCard weatherData={weatherData} />
      </main>
    </div>
  );
};

export default Weather;
