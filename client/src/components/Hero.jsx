import "../styles/Hero.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";


const Hero = () => {
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
