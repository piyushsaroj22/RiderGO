import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Dashboard from "../pages/dashboard/Dashboard";

import UserLayout from "../layouts/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/reset-password/:accountType/:token"
            element={<ResetPassword />}
          />
        </Route>

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Existing pages - temporarily keep placeholders */}
            <Route path="/ride" element={<div>Ride</div>} />

            <Route path="/history" element={<div>History</div>} />

            <Route path="/payment" element={<div>Payment</div>} />

            <Route path="/profile" element={<div>Profile</div>} />
          </Route>
        </Route>

        <Route path="/" element={<div>RiderGO</div>} />

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
