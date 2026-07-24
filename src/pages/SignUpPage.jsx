import { useState } from "react";
import { signUp } from "../services/auth";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      console.log("Email being sent:", email);
      await signUp(email, password);
      setMessage("Account created! Check your email to verify.");
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

        <button type="submit">Sign Up</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default SignUpPage;
