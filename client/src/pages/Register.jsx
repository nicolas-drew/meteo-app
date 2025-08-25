import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SignupForm from "../components/SignupForm";

const Register = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <SignupForm />
      </main>
      <Footer />
    </div>
  );
};

export default Register;
