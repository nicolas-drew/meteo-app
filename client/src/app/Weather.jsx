import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/Weather.css";
import WeatherCard from '../components/WeatherCard';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const Weather = () => {
    return (
    <div className="app-container">
      <main className="main-content weather-page">
        <WeatherCard weatherData={weatherData} />
      </main>
    </div>
  );
}

export default Weather;