import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../utils/auth";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = getToken();
    
        if (token) {
          setIsAuthenticated(true);
        }
    
        setTimeout(() => {
          setIsLoading(false);
        }, 300); // small delay for UX
      }, []);

      if (isLoading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <p className="text-lg font-medium">Checking access...</p>
          </div>
        );
      }

      if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
    
      return children;
    };


    export default ProtectedRoute;