import AuthForm from "@/components/auth/auth-form";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  // Don't show auth page if already logged in or still loading
  if (isLoading || user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2">
        {/* Form Column */}
        <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800">
          <AuthForm />
        </div>

        {/* Hero Column */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-6">
              Save and Organize Your Bookmarks
            </h1>
            <p className="text-xl mb-6">
              LinkSaver helps you save important links with auto-generated summaries, making it easier to find and remember your bookmarks.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Save any URL with a single click</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Automatic summaries using AI</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Beautiful, responsive interface</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
