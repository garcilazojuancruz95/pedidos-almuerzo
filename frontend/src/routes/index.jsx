import { BrowserRouter, Routes, Route } from "react-router-dom";

import OperatorLayout from "../layouts/OperatorLayout";

import ProtectedRoute from "../components/ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Publications from "../pages/Publications";
import DailyOrders from "../pages/DailyOrders";
import MyOrder from "../pages/MyOrder";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Operador */}
        <Route
          element={
            <ProtectedRoute>
              <OperatorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/my-order" element={<MyOrder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/daily-orders" element={<DailyOrders />} />
        </Route>

        {/* Página no encontrada */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}