import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
