import WeatherMap from "../components/WeatherMap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Map = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <WeatherMap />
      </main>
      <Footer />
    </div>
  );
};

export default Map;
