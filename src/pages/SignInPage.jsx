import { useState } from "react";
import { signIn } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import "./SignInPage.css";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const data = await signIn(email, password);

      if (!data.native_language) {
        navigate("/select-presets", { replace: true });
      } else {
        navigate("/write", { replace: true });
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-modal">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">
          Sign in to continue your language journey.
        </p>

        <form onSubmit={handleSubmit}>
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

          <button className="auth-button" type="submit">
            Sign In
          </button>
        </form>

        {message && <p className="auth-error">{message}</p>}

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default SignInPage;
