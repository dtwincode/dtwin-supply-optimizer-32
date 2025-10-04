
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/images/dtwin-logo.png";

export default function Auth() {
  const { user, signIn, signUp, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();

  const handleSubmit = async (action: "signIn" | "signUp") => {
    setIsSubmitting(true);
    try {
      if (action === "signIn") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-muted/20">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNiA2LTIuNjg2IDYtNi0yLjY4Ni02LTYtNnptMCA4Yy0xLjEwNSAwLTItLjg5NS0yLTJzLjg5NS0yIDItMiAyIC44OTUgMiAyLS44OTUgMi0yIDJ6IiBmaWxsPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4wNSkiLz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="relative z-10">
          <img
            src={logo}
            alt="dtwin logo"
            className="h-20 w-auto object-contain mb-8"
          />
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to dtwin
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            Advanced supply chain optimization platform with AI-powered forecasting, inventory management, and demand-driven planning solutions.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span>Innovate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{animationDelay: "0.3s"}}></div>
              <span>Integrate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{animationDelay: "0.6s"}}></div>
              <span>Accelerate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <img
              src={logo}
              alt="dtwin logo"
              className="h-16 w-auto object-contain mx-auto mb-4"
            />
          </div>

          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Sign In
              </CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </CardHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit("signIn"); }}>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 pt-2">
                <Button 
                  className="w-full h-11 font-medium" 
                  type="submit" 
                  disabled={isSubmitting || !email || !password}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      Please wait...
                    </span>
                  ) : "Sign In"}
                </Button>
                
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full h-11 font-medium" 
                  type="button" 
                  variant="outline"
                  onClick={(e) => { e.preventDefault(); handleSubmit("signUp"); }}
                  disabled={isSubmitting || !email || !password}
                >
                  {isSubmitting ? "Please wait..." : "Create New Account"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
