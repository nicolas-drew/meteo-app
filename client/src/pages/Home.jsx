import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
