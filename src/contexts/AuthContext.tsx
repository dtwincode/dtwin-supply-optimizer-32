import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const MOCK_USER: User = {
  id: "mock-user-id",
  app_metadata: {},
  user_metadata: { name: "Dev User", email: "dev@example.com" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "dev@example.com",
  phone: "123123",
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: "authenticated",
  updated_at: new Date().toISOString(),
};

const USE_MOCK = false; // Set to true in dev env

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (USE_MOCK) {
      // Mock auth session
      const timer = setTimeout(() => {
        setUser(MOCK_USER);
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Real Supabase auth session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (USE_MOCK) {
      console.log("Mock signIn:", email, password);
      setUser(MOCK_USER);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    if (USE_MOCK) {
      console.log("Mock signUp:", email, password);
      setUser(MOCK_USER);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    }
  };

  const signOut = async () => {
    if (USE_MOCK) {
      console.log("Mock signOut");
      setUser(null);
      navigate("/auth");
    } else {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      navigate("/auth");
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
