import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/auth";
import ProtectedRoute from "./components/shared/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AlumniDetailPage from "./pages/AlumniDetailPage";

// Helper component to redirect while preserving URL parameters
function RedirectWithParams({ to }) {
  const params = useParams();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const path = Object.keys(params).reduce(
      (path, param) => path.replace(`:${param}`, params[param]),
      to
    );
    navigate(path, { replace: true });
  }, [navigate, params, to]);
  
  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
            <Route path="/profile" element={<Navigate to="/dashboard/settings" replace />} />
            {/* Alumni detail moved to dashboard nested routes */}
            <Route path="/alumni/:id" element={
              <RedirectWithParams to="/dashboard/alumni/:id" />
            } />
          </Route>
          
          {/* Redirect from the old verify-pending route to the new verify-email route */}
          <Route path="/verify-pending" element={<Navigate to="/verify-email" replace />} />
          
          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;