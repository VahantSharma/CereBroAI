import SignInForm from "@/components/SignInForm";
import { useAuth } from "@/contexts/AuthContext";
import { Brain } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

const SignIn = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cerebro-darker">
      {/* Header */}
      <header className="py-6 border-b border-white/10">
        <div className="container mx-auto px-4">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-cerebro-accent" />
            <span className="font-serif text-xl font-semibold">CereBro AI</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-cerebro-dark border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <SignInForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-white/10 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} CereBro AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SignIn;
