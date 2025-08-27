import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Weather from "./pages/Weather";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import Legal from "./pages/Legal";
import Contact from "./pages/Contact";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/weather/:city" element={<Weather />} />
            <Route path="/map" element={<Map />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
