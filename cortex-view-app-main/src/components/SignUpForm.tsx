import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Check, Eye, EyeOff, Info } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRequirements = [
    {
      id: "length",
      text: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      id: "uppercase",
      text: "At least 1 uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      text: "At least 1 lowercase letter",
      valid: /[a-z]/.test(password),
    },
    { id: "number", text: "At least 1 number", valid: /\d/.test(password) },
    {
      id: "special",
      text: "At least 1 special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
    {
      id: "match",
      text: "Passwords match",
      valid: password === confirmPassword && confirmPassword !== "",
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordRequirements.every((req) => req.valid)) {
      toast({
        title: "Invalid password",
        description: "Please ensure your password meets all requirements",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);

      toast({
        title: "Account created",
        description: "Welcome to CereBro AI",
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md w-full p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <Brain className="h-10 w-10 text-cerebro-accent" />
        </div>
        <h1 className="text-3xl font-serif font-bold">Create an Account</h1>
        <p className="text-gray-400">Join CereBro AI to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-cerebro-dark border-white/10 focus-visible:ring-cerebro-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-cerebro-dark border-white/10 focus-visible:ring-cerebro-accent"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-0 h-auto">
                    <Info size={16} className="text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-cerebro-dark border-white/10">
                  <p className="text-xs text-gray-300">
                    Password must be at least 8 characters
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-cerebro-dark border-white/10 focus-visible:ring-cerebro-accent pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-cerebro-dark border-white/10 focus-visible:ring-cerebro-accent pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-gray-400">Password requirements:</p>
          <ul className="space-y-1">
            {passwordRequirements.map((req) => (
              <li
                key={req.id}
                className={`flex items-center text-xs ${
                  req.valid ? "text-green-500" : "text-gray-400"
                }`}
              >
                {req.valid ? (
                  <Check size={14} className="mr-1.5" />
                ) : (
                  <div className="w-3.5 h-3.5 mr-1.5 border border-gray-400 rounded-full flex items-center justify-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        password ? "bg-gray-400" : ""
                      }`}
                    ></div>
                  </div>
                )}
                {req.text}
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="submit"
          className="w-full bg-cerebro-accent hover:bg-cerebro-accent/90"
          disabled={
            isLoading || !passwordRequirements.every((req) => req.valid)
          }
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-cerebro-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
