import { useState } from "react";
import { signUp } from "../services/auth";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Create Account</h2>

      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">Sign Up</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default SignUpPage;
