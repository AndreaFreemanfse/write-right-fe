import { useState } from "react";
import { signUp } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import "./SignUpPage.css";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleSignUp(event) {
    event.preventDefault();
    setMessage("");

    try {
      await signUp(email, password);

      navigate("/check-email", {
        state: {
          email,
        },
      });
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-modal">
        <h2>Create Account</h2>

        <p className="auth-subtitle">Start improving your writing today.</p>

        <form onSubmit={handleSignUp}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="app-button app-button--special auth-button" type="submit">
            Create Account
          </button>
        </form>

        {message && <p className="auth-error">{message}</p>}

        <p className="auth-switch">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
