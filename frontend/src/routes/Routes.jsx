import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import OperatorLayout from "../layouts/OperatorLayout";

import ProtectedRoute from "../components/ProtectedRoute";

import Users from "../pages/Users";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Login from "../pages/Login";
import Publications from "../pages/Publications";
import DailyOrders from "../pages/DailyOrders";
import MyOrder from "../pages/MyOrder";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import { useAuth } from "../contexts/AuthContext";


function RoleRedirect() {
  const { usuario } = useAuth();

  const rol = usuario?.roles?.nombre;

  if (rol === "Empleado") {
    return <Navigate to="/my-order" replace />;
  }

  if (rol === "Operador" || rol === "Administrador") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          }
        />

        {/* Operador */}
        <Route
          element={
            <ProtectedRoute roles={["Operador", "Administrador"]}>
              <OperatorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/daily-orders" element={<DailyOrders />} />
          <Route path="/users" element={<Users />} />
        </Route>

        {/* Empleado */}
        <Route
          element={
            <ProtectedRoute roles={["Empleado"]}>
              <OperatorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/my-order" element={<MyOrder />} />
        </Route>

        {/* Perfil - cualquier usuario autenticado */}
        <Route
          element={
            <ProtectedRoute>
              <OperatorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Página no encontrada */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}