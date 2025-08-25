import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // <-- simulation

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const toggleLogin = () => {
    setIsLoggedIn((prev) => !prev);
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
        <a href="#" className="navbar-link">
          Page3
        </a>
      </div>

      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <button className="navbar-deconnexion" onClick={toggleLogin}>
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
            <Link to="/signup" className="navbar-inscription">
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
