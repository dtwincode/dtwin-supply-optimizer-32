
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    // Check system preference
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    
    // Set initial theme
    const initialTheme = savedTheme || systemPreference;
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
    
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode Activated`,
      description: `Switched to ${newTheme} mode`,
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {theme === "light" ? (
        <Moon className="h-6 w-6" />
      ) : (
        <Sun className="h-6 w-6" />
      )}
    </Button>
  );
}
