import { Routes, Route, Outlet } from "react-router-dom";
import { Home } from "./pages/Home";
import { ProjectDetail } from "./pages/ProjectDetail";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function AdminLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/mgmt-x7k2" element={<AdminLayout />}>
        <Route index element={<AdminLogin />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
