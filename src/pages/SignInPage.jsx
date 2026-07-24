import { useState } from "react";
import { signIn } from "../services/auth";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      await signIn(email, password);
      setMessage("Successful.");
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <div>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Sign In</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default SignInPage;
