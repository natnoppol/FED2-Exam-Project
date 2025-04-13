import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
    const token = getToken();

    if (!token) {
        // Not logged in, redirect to login
        return <Navigate to="/login" replace />;
      }

      return children;

    };

    export default ProtectedRoute;