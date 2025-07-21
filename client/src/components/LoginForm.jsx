import { FcGoogle } from "react-icons/fc";
import "./Form.css";
import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <form className="login-form">
      <h2 className="title-form">Connexion</h2>
      <button className="login-google">
        <FcGoogle /> Continuer avec Google
      </button>
      <input required type="email" placeholder="Email" name="email" />
      <input required type="password" placeholder="Mot de passe" />
      <span className="forgot-password">
        <a href="#" className="">
          Mot de passe oublié ?
        </a>
      </span>
      <button className="login-btn">Se connecter</button>
      <span className="no-account">
        Pas encore de compte ?&nbsp;
        <Link to="/signup" className="form-inscription">
          s'inscrire
        </Link>
      </span>
    </form>
  );
};

export default LoginForm;
