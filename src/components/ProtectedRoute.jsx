import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user, loading, profileLoading, onboardingComplete } = useAuth();
  const location = useLocation();

  console.log("[ProtectedRoute] loading:", loading, "profileLoading:", profileLoading, "user:", !!user, "onboardingComplete:", onboardingComplete, "pathname:", location.pathname);

  if (loading || profileLoading) {
    return <p>Loading...</p>;
  }

  if (user && !onboardingComplete && location.pathname !== "/select-presets") {
    return <Navigate to="/select-presets" replace />;
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
