import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => { // Removed : React.FormEvent
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual authentication logic
      // In a real application, you would send a request to your backend here
      // e.g., fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      if (email && password) {
        // Simulate a successful login
        localStorage.setItem("user", JSON.stringify({ email }));
        toast({
          title: "Login successful!",
          description: "Welcome back to AI Assistant Pro",
        });
        navigate("/dashboard");
      } else {
        throw new Error("Please fill in all fields");
      }
    } catch (error) {
      console.error("Login error:", error); // Log the actual error for debugging
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again", // Use error.message if available
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card >
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your AI Assistant Pro account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
           <div className="w-full">
            <Button type="submit" className=" w-full px-8 py-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button></div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;