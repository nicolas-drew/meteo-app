import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">Weather</div>

      <div className="navbar-center">
        <Link to="/">Accueil</Link>
        <Link to="/map">Carte</Link>
      </div>

      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <button className="navbar-deconnexion" onClick={handleLogout}>
              Déconnexion
            </button>
            <Link to="/profile" className="navbar-profile">
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-connexion">
              Connexion
            </Link>
            <Link to="/register" className="navbar-inscription">
              Inscription
            </Link>
          </>
        )}

        <div className="toggle-switch" onClick={toggleTheme}>
          <div className={`toggle-thumb ${darkMode ? "right" : ""}`}>
            {darkMode ? (
              <div className="lune"></div>
            ) : (
              <div className="soleil"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
