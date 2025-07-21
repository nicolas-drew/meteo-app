import "../styles/Hero.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

const API_KEY = "b3fb14b1f7a5d7647d2ff786da7d136b";

const Hero = () => {
  const [city, setCity] = useState("");
  

  return (
    <div className="hero">
      <h1>Consulte la météo</h1>
      <div className="search-bar">
        <FaLocationDot className="icon-location"/>
        <input type="text" placeholder="Saisis ta ville" />
        <button><FaSearch /></button>
      </div>
    </div>
  );
};

export default Hero;
