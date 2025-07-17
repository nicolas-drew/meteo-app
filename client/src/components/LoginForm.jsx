import { FcGoogle } from "react-icons/fc";
import "./LoginForm.css"

const LoginForm = () => {
  return (
    <form className="login-form">
      <h2 className="title-form">Connexion</h2>
      <button className="login-google">
        <FcGoogle /> Continuer avec Google
      </button>
      <input required type="email" placeholder="Email" name="email" />
      <input required type="password" placeholder="********" />
      <span className="forgot-password"><a href="#" className="">Mot de passe oublié ?</a></span>
      <button>Se connecter</button>
    </form>
  );
};

export default LoginForm;
