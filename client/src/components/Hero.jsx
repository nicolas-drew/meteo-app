import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <h1>Consulte la météo</h1>
      <div className="search-bar">
        <input type="text" placeholder="Saisis ta ville" />
        <button>Search</button>
      </div>
    </div>
  );
};

export default Hero;
