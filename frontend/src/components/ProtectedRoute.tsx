import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuth();

  if (authenticated === null) {
    return <div className="p-6 font-mono text-sm text-bone-dim">Loading…</div>;
  }

  if (!authenticated) {
    return <Navigate to="/mgmt-x7k2" replace />;
  }

  return <>{children}</>;
}
