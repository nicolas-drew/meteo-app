import "../styles/Form.css";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const SignupForm = () => {
  return (
    <form className="signup-form">
      <h2 className="title-form">Inscription</h2>
      <button className="login-google">
        <FcGoogle /> Continuer avec Google
      </button>
      <input required type="email" placeholder="Email" name="email" />
      <input
        required
        type="password"
        placeholder="Mot de passe"
        name="password"
      />
      <input
        required
        type="password"
        placeholder="Confirmer le mot de passe"
        name="confirmPassword"
      />
      <button className="signup-btn">S'inscrire</button>
      <span className="yes-account">
        Déjà un compte ?&nbsp;
        <Link to="/login" className="form-connexion">
          connexion
        </Link>
      </span>
    </form>
  );
};

export default SignupForm;
