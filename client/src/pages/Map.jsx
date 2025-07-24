import WeatherMap from "../components/WeatherMap";
import Navbar from "../components/Navbar";

const Map = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <WeatherMap />
      </main>
    </div>
  );
};

export default Map;
