import { Link, useLocation } from "react-router-dom";
import "./CheckEmailPage.css";

function CheckEmailPage() {
  const { state } = useLocation();

  return (
    <div className="check-email-page">
      <div className="check-email-card">
        <div className="email-icon">📬</div>

        <h1>Check your email</h1>

        <p className="email-message">We've sent a verification email to:</p>

        <strong className="user-email">{state?.email}</strong>

        <p className="instruction">
          Click the verification link in your inbox to activate your account.
        </p>

        <Link className="login-button" to="/signin">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default CheckEmailPage;
