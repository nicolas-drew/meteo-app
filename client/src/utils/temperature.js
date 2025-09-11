// Fonction pour convertir Celsius vers Fahrenheit
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9) / 5 + 32;
};

// Fonction pour convertir Fahrenheit vers Celsius
export const fahrenheitToCelsius = (fahrenheit) => {
  return ((fahrenheit - 32) * 5) / 9;
};

// Hook personnalisé pour formater la température selon les préférences
export const useTemperature = (user) => {
  const formatTemperature = (temp) => {
    if (!temp && temp !== 0) return "";

    const units = user?.preferences?.units || "metric";

    // Si l'utilisateur veut Fahrenheit mais l'API renvoie en Celsius
    if (units === "imperial") {
      return `${Math.round(temp)}°F`;
    }

    return `${Math.round(temp)}°C`;
  };

  const getUnitsForAPI = () => {
    const units = user?.preferences?.units || "metric";
    return units; // 'metric' pour Celsius, 'imperial' pour Fahrenheit
  };

  return {
    formatTemperature,
    getUnitsForAPI,
    isImperial: user?.preferences?.units === "imperial",
  };
};
