import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">Weather</div>
        
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`navbar-content ${isMobileMenuOpen ? "active" : ""}`}>
          <div className="navbar-links">
            <Link to="/" onClick={closeMobileMenu}>Accueil</Link>
            <Link to="/map" onClick={closeMobileMenu}>Carte</Link>
          </div>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <button className="navbar-deconnexion" onClick={handleLogout}>
                  Déconnexion
                </button>
                <Link to="/profile" className="navbar-profile" onClick={closeMobileMenu}>
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-connexion" onClick={closeMobileMenu}>
                  Connexion
                </Link>
                <Link to="/register" className="navbar-inscription" onClick={closeMobileMenu}>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
