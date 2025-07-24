import "../styles/Hero.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      navigate(`/weather/${encodeURIComponent(city.trim())}`);
    }
  };

  return (
    <div className="hero">
      <h1>Consulte la météo</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <FaLocationDot
          className="icon-location"
          title="Utiliser ma position actuelle"
        />
        <input
          type="text"
          placeholder="Saisis ta ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>
    </div>
  );
};

export default Hero;
