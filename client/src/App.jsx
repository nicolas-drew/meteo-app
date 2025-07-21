import Home from "./App/Home";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./App/Login";
import Signup from "./App/Signup";
import Weather from "./app/Weather";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/weather/:city" element={<Weather />}/>
        </Routes>
      </Router>
  );
}

export default App;
