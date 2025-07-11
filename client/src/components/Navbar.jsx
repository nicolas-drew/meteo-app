import "./Navbar.css";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">Weather</div>
      <div className="navbar-actions">
        <button className="navbar-link">Connexion</button>
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
