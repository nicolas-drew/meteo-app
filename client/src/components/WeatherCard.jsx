import "../styles/WeatherCard.css";

const WeatherCard = ({ weatherData }) => {
  const { current, forecast } = weatherData;

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="weather-card">
      <div className="weather-main">
        <h1 className="city-name">{current.name}</h1>
        <div className="temperature">{Math.round(current.main.temp)}°C</div>
        <div className="weather-description">
          {current.weather[0].description}
        </div>
        <img
          src={getWeatherIcon(current.weather[0].icon)}
          alt={current.weather[0].description}
          className="weather-icon-main"
        />
      </div>

      <div className="weather-forecast">
        {forecast.map((item, index) => {
          return (
            <div key={index} className="forecast-item">
              <img
                src={getWeatherIcon(item.weather[0].icon)}
                alt={item.weather[0].description}
                className="weather-icon-small"
              />
              <div className="forecast-temp">
                {Math.round(item.main.temp)}°C
              </div>
              <div className="forecast-time">
                {index === 0 ? "Maintenant" : formatTime(item.dt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherCard;
