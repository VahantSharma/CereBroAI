import {
  checkAuthStatus,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the user type
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if user is authenticated on initial load and on token changes
  const verifyAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await checkAuthStatus();

      setUser(userData);

      // Set isLoading to false even if no user is found
      // This is important to properly render routes that depend on auth status
      setIsLoading(false);
      setAuthChecked(true);
    } catch (error) {
      console.error("Auth verification failed:", error);
      setUser(null);
      setIsLoading(false);
      setAuthChecked(true);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    verifyAuth();

    // Setup a listener for storage events to ensure auth state consistency
    // across tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cerebro_token") {
        if (!e.newValue) {
          // Token was removed in another tab/window
          setUser(null);
        } else if (e.newValue !== e.oldValue) {
          // Token changed, re-verify
          verifyAuth();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [verifyAuth]);

  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const userData = await loginUser(email, password);
      setUser(userData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to login. Please check your credentials.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const userData = await registerUser(name, email, password);
      setUser(userData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
  };

  // Only render children after initial auth check is complete
  if (!authChecked && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cerebro-darker">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-cerebro-accent border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
