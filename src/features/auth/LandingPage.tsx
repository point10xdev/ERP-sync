import { Link } from "react-router-dom"; // Used to create navigation links without reloading the page
import { ROUTES } from "../../app/routes"; 
import { useAuth } from "./store/authAtoms"; // Custom hook for auth operations like login, logout, etc.
import { useEffect } from "react"; 

/* If the user is already authenticated, it will automatically log them out. */

export const LandingPage = () => {
  // Destructure `isAuthenticated` and `logout` from the custom auth hook
  const { isAuthenticated, logout } = useAuth();

  // Effect runs on component mount and whenever `isAuthenticated` or `logout` changes
  useEffect(() => {
    // If a user somehow reaches this page while authenticated, log them out
    if (isAuthenticated) {
      logout(); // This clears their session and updates global auth state
    }
  }, [isAuthenticated, logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Centered container with some padding, shadow, and background */}
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        {/* Header section */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to ERP Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please select your login type
          </p>
        </div>

        {/* Buttons to navigate to Faculty and Student login pages */}
        <div className="mt-8 space-y-4">
          <Link
            to={ROUTES.FACULTY_LOGIN} // Navigate to faculty login page
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                       text-sm font-medium rounded-md text-white bg-purple-600 
                       hover:bg-purple-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-purple-500"
          >
            Faculty Login
          </Link>

          <Link
            to={ROUTES.STUDENT_LOGIN} // Navigate to student login page
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                       text-sm font-medium rounded-md text-white bg-indigo-600 
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-indigo-500"
          >
            Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};
