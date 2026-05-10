import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../assets/UserContext";
import { getAuthToken, isTokenValid } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userData } = useContext(UserContext);
  const token = getAuthToken();

  if (!userData || !isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

