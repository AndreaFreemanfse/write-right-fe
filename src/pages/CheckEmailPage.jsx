import { Link, useLocation } from "react-router-dom";

function CheckEmailPage() {
  const { state } = useLocation();

  return (
    <div className="check-email-page">
      <h1>Check your email 📬</h1>

      <p>
        We've sent a verification email to <strong>{state?.email}</strong>.
      </p>

      <p>Please click the verification link to activate your account.</p>

      <Link to="/login">Back to Login</Link>
    </div>
  );
}

export default CheckEmailPage;
