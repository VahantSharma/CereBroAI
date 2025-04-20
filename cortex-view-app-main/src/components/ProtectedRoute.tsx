import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading indicator or placeholder while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cerebro-darker">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-cerebro-accent border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Render children or outlet
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
