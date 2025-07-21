const WeatherCard = ({ weatherData }) => {
  return (
    <div className="weather-card">
      <h2>{weatherData.city}</h2>
      <p>{weatherData.description}</p>
      <p>{weatherData.temperature}°C</p>
      <img
        src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
        alt={weatherData.description}
      />
    </div>
  );
};

export default WeatherCard;