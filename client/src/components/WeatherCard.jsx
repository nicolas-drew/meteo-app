import "../styles/WeatherCard.css";
import "../styles/WeatherAnim.css";
import { useAuth } from "../contexts/AuthContext";
import { useTemperature } from "../utils/temperature";

const WeatherCard = ({ weatherData }) => {
  const { current, forecast } = weatherData;
  const { user } = useAuth();
  const { formatTemperature } = useTemperature(user);

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWeatherIcon = (iconCode) => {
    const dayIconCode = iconCode.replace("n", "d");
    return `https://openweathermap.org/img/wn/${dayIconCode}@2x.png`;
  };

  return (
    <div className="weather-card">
      <div className="weather-main">
        <h1 className="city-name">{current.name}</h1>
        <div className="temperature">
          {formatTemperature(current.main.temp)}
        </div>
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
                {formatTemperature(item.main.temp)}
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
