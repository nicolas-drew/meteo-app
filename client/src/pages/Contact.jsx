import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Contact.css";
import { FaGithub, FaGlobe } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="app-container contact-page">
      <Navbar />
      <main className="contact-content">
        <div className="contact-card">
          <h1>Contact</h1>
          <p className="contact-intro">
            Ce projet a été réalisé par <strong>Nicolas Drew</strong>.
            <br />
            Retrouvez mes autres projets et contactez-moi via les liens ci-dessous.
          </p>
          
          <div className="contact-links">
            <a 
              href="https://github.com/nicolas-drew" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link github"
            >
              <FaGithub className="icon" />
              <span>Mon GitHub</span>
            </a>
            
            <a 
              href="https://nicolas-drew.github.io/Portfolio/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link portfolio"
            >
              <FaGlobe className="icon" />
              <span>Mon Portfolio & Contact</span>
            </a>
          </div>

          <div className="contact-note">
            <p>Un formulaire de contact complet est disponible directement sur mon portfolio.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
