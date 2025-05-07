import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Moon, Sun, Bookmark } from "lucide-react";
import UserMenu from "./user-menu";

export default function Header() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <div className="text-primary-600 dark:text-primary-400">
              <Bookmark className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">LinkSaver</h1>
          </a>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {user && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}
