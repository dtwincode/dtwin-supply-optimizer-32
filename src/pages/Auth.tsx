
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex items-center gap-8 max-w-[900px] w-full">
        <div className="flex-1 flex justify-center">
          <img
            src={logo}
            alt="dtwin logo"
            className="h-96 w-auto object-contain"
          />
        </div>
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
          </CardHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit("signIn"); }}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                className="w-full" 
                type="submit" 
                disabled={isSubmitting || !email || !password}
              >
                {isSubmitting ? "Please wait..." : "Sign In"}
              </Button>
              <Button 
                className="w-full" 
                type="button" 
                variant="outline"
                onClick={(e) => { e.preventDefault(); handleSubmit("signUp"); }}
                disabled={isSubmitting || !email || !password}
              >
                {isSubmitting ? "Please wait..." : "Sign Up"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
