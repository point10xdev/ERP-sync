import { useEffect } from "react";
import { useInitAuth } from "./store/authAtoms"; // Importing the custom hook that initializes auth state
import { AUTH_CONFIG } from "../../config"; // Import auth config to verify token storage

// This component is used to initialize the authentication state when the app loads
export const AuthInitializer: React.FC = () => {
  // Extracting the `initializeAuth` function from the custom `useInitAuth` hook
  const { initializeAuth } = useInitAuth();

  // useEffect is used to run the initialization logic once when the component mounts (on app load)
  useEffect(() => {
    console.log("AuthInitializer: Starting auth initialization");

    // Check if there's a token in localStorage for debugging
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    const user = localStorage.getItem(AUTH_CONFIG.USER_KEY);

    console.log("AuthInitializer: Current storage state:", {
      hasToken: !!token,
      hasUserData: !!user,
      userData: user ? JSON.parse(user) : null,
    });

    // Call the initializeAuth function when the component mounts (it will check for a stored token and validate it)
    initializeAuth()
      .then(() => {
        console.log(
          "AuthInitializer: Auth initialization completed successfully"
        );
      })
      .catch((error) => {
        console.error("AuthInitializer: Auth initialization failed", error);
      });
  }, []); // Empty dependency array means this effect runs only once, when the component is first mounted

  return null; // Returning null means this component doesn't produce any visible UI
};
