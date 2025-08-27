import { useState } from "react";
import "../styles/Form.css";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const { register, error, clearError, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Nettoyer les erreurs quand l'utilisateur tape
    if (error) clearError();
    if (localError) setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError("");

    // Validation côté client
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setLocalError("Le mot de passe doit contenir au moins 8 caractères");
      setIsSubmitting(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
      });
      navigate("/"); // Rediriger vers l'accueil
    } catch (err) {
      console.error("Erreur d'inscription:", err.message);
      // L'erreur est déjà gérée par le context
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Boolean(
    formData.email && formData.password && formData.confirmPassword
  );
  const areInputsDisabled = loading || isSubmitting;
  const isSubmitDisabled = loading || isSubmitting || !isFormValid;
  const displayError = localError || error;

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2 className="title-form">Inscription</h2>

      {displayError && (
        <div
          className="error-message"
          style={{
            color: "red",
            marginBottom: "10px",
            textAlign: "center",
            fontSize: "0.9rem",
          }}
        >
          {displayError}
        </div>
      )}

      <button type="button" className="login-google" disabled>
        <FcGoogle /> Continuer avec Google
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
        placeholder="Mot de passe (8 caractères min)"
        name="password"
        value={formData.password}
        onChange={handleChange}
        disabled={areInputsDisabled}
      />

      <input
        required
        type="password"
        placeholder="Confirmer le mot de passe"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={areInputsDisabled}
      />

      <button type="submit" className="signup-btn" disabled={isSubmitDisabled}>
        {loading || isSubmitting ? "Inscription..." : "S'inscrire"}
      </button>

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
