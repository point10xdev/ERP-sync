import { useEffect } from "react";
import { useInitAuth } from "./authAtoms";

// This component initializes the auth state when the app loads
export const AuthInitializer: React.FC = () => {
  const { initializeAuth } = useInitAuth();

  useEffect(() => {
    initializeAuth();
  }, []);

  // This component doesn't render anything
  return null;
};
