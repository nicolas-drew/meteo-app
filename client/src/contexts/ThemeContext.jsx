import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Récupérer le thème depuis localStorage au chargement (pour les non-connectés)
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // Sauvegarder dans localStorage pour les utilisateurs non-connectés
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));

    // Appliquer immédiatement le thème
    document.body.className = newDarkMode ? "dark" : "light";
  };

  // Synchroniser avec les préférences utilisateur (cette fonction sera appelée depuis AuthContext)
  const setThemeFromUserPreferences = (userTheme) => {
    if (userTheme === "auto") {
      // Détecter le thème système
      const systemDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(systemDarkMode);
      document.body.className = systemDarkMode ? "dark" : "light";
    } else {
      const isDark = userTheme === "dark";
      setDarkMode(isDark);
      document.body.className = userTheme;
    }
  };

  // Appliquer le thème au chargement initial (pour les non-connectés)
  useEffect(() => {
    // Ne pas appliquer si l'utilisateur est connecté (géré par AuthContext)
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      document.body.className = darkMode ? "dark" : "light";
    }
  }, []);

  // Écouter les changements du thème système
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Seulement si l'utilisateur a choisi "auto" ou n'est pas connecté
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setDarkMode(e.matches);
        document.body.className = e.matches ? "dark" : "light";
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        setThemeFromUserPreferences,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
