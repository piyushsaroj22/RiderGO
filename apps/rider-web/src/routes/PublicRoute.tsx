import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const PublicRoute = () => {
  const { isAuthenticated, isInitializing } = useAppSelector(
    (state) => state.auth,
  );

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
