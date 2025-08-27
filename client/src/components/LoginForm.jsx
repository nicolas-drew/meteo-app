import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import "../styles/Form.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error, clearError, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      console.error("Erreur de connexion:", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Boolean(formData.email && formData.password);
  const areInputsDisabled = loading || isSubmitting;
  const isSubmitDisabled = loading || isSubmitting || !isFormValid;

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="title-form">Connexion</h2>

      {error && (
        <div
          className="error-message"
          style={{
            color: "red",
            marginBottom: "10px",
            textAlign: "center",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      <button type="button" className="login-google" disabled>
        <FcGoogle className="logo-google" />
        Continuer avec Google
      </button>

      <input
        required
        type="email"
        placeholder="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        disabled={areInputsDisabled}
      />

      <input
        required
        type="password"
        placeholder="Mot de passe"
        name="password"
        value={formData.password}
        onChange={handleChange}
        disabled={areInputsDisabled}
      />

      <span className="forgot-password">
        <a href="#" className="">
          Mot de passe oublié ?
        </a>
      </span>

      <button type="submit" className="login-btn" disabled={isSubmitDisabled}>
        {loading || isSubmitting ? "Connexion..." : "Se connecter"}
      </button>

      <span className="no-account">
        Pas encore de compte ?&nbsp;
        <Link to="/register" className="form-inscription">
          s'inscrire
        </Link>
      </span>
    </form>
  );
};

export default LoginForm;
