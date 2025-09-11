// Convertir Celsius vers Fahrenheit
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9) / 5 + 32;
};

// Convertir Fahrenheit vers Celsius
export const fahrenheitToCelsius = (fahrenheit) => {
  return ((fahrenheit - 32) * 5) / 9;
};

export const useTemperature = (user) => {
  const formatTemperature = (temp) => {
    if (!temp && temp !== 0) return "";

    const units = user?.preferences?.units || "metric";

    if (units === "imperial") {
      const fahrenheit = celsiusToFahrenheit(temp);
      return `${Math.round(fahrenheit)}°F`;
    }

    return `${Math.round(temp)}°C`;
  };

  const getUnitsForAPI = () => {
    return "metric";
  };

  return {
    formatTemperature,
    getUnitsForAPI,
    isImperial: user?.preferences?.units === "imperial",
  };
};
