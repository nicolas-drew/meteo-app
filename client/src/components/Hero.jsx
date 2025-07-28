import "../styles/Hero.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [city, setCity] = useState("");
  const [loadinglocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    handleLocationClick();
  }, []);

  const handleLocationClick = async () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const userCity =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            "";

          setCity(userCity);

          const localHour = new Date().getHours();
          if (localHour >= 20 || localHour < 7) {
            document.body.className = "dark";
          } else document.body.className = "light";
          setLoadingLocation(false);
        },
        (error) => {
          alert("Impossible d'obtenir la position : " + error.message);
          setLoadingLoc(false);
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
      setLoadingLoc(false);
    }
  };

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
        <button
          type="button"
          className="location-button"
          onClick={handleLocationClick}
          disabled={loadinglocation}
          title="Utiliser ma position"
        >
          <FaLocationDot className="icon-location" />
        </button>
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
