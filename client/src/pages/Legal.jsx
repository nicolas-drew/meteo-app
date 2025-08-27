import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Legal.css";

const Legal = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="legal-container">
          <h1>Mentions Légales</h1>

          <section className="legal-section">
            <h2>1. Informations légales</h2>
            <p>
              <strong>Nom du site :</strong> Weather App
              <br />
              <strong>Propriétaire :</strong> [Votre nom ou société]
              <br />
              <strong>Siège social :</strong> [Votre adresse]
              <br />
              <strong>Téléphone :</strong> [Votre numéro]
              <br />
              <strong>Email :</strong> contact@weather-app.com
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Hébergement</h2>
            <p>
              Ce site est hébergé par :<br />
              <strong>Hébergeur :</strong> [Nom de l'hébergeur]
              <br />
              <strong>Adresse :</strong> [Adresse de l'hébergeur]
              <br />
              <strong>Téléphone :</strong> [Numéro de l'hébergeur]
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et
              internationale sur le droit d'auteur et la propriété
              intellectuelle. Tous les droits de reproduction sont réservés, y
              compris pour les documents téléchargeables et les représentations
              iconographiques et photographiques.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Données météorologiques</h2>
            <p>
              Les données météorologiques affichées sur ce site sont fournies
              par OpenWeatherMap API. Ces données sont mises à jour
              régulièrement mais leur exactitude ne peut être garantie à 100%.
              L'utilisation de ces informations se fait sous votre propre
              responsabilité.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Protection des données personnelles</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données
              (RGPD), vous disposez d'un droit d'accès, de rectification, de
              portabilité et d'effacement de vos données personnelles. Pour
              exercer ces droits, vous pouvez nous contacter à l'adresse :
              privacy@weather-app.com
            </p>
            <p>Les données collectées sont :</p>
            <ul>
              <li>Adresse email (obligatoire pour la création de compte)</li>
              <li>Villes favorites (pour personnaliser votre expérience)</li>
              <li>Préférences d'affichage (thème, unités)</li>
            </ul>
            <p>
              Ces données ne sont jamais partagées avec des tiers et sont
              utilisées uniquement pour le fonctionnement du service.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Cookies</h2>
            <p>
              Ce site utilise des cookies techniques nécessaires au bon
              fonctionnement de l'application (authentification, préférences).
              Aucun cookie de tracking ou publicitaire n'est utilisé.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Responsabilité</h2>
            <p>
              Les informations contenues sur ce site sont aussi précises que
              possible. Toutefois, le propriétaire ne pourra être tenu
              responsable des omissions, des inexactitudes et des carences dans
              la mise à jour, qu'elles soient de son fait ou du fait des tiers
              partenaires qui lui fournissent ces informations.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Liens hypertextes</h2>
            <p>
              Les liens hypertextes mis en place dans le cadre du présent site
              internet en direction d'autres ressources présentes sur le réseau
              Internet ne sauraient engager la responsabilité du propriétaire du
              site.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Litiges</h2>
            <p>
              Les présentes conditions du site sont régies par les lois
              françaises et toute contestation ou litiges qui pourraient naître
              de l'interprétation ou de l'exécution de celles-ci seront de la
              compétence exclusive des tribunaux français.
            </p>
          </section>

          <div className="legal-navigation">
            <Link to="/" className="back-button">
              &larr; Retour à l'accueil
            </Link>
            <Link to="/contact" className="contact-link">
              Contact &rarr;
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
