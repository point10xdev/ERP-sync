import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Used to navigate after login
import { Loader } from "lucide-react"; // Spinner icon shown while loading
import { useAuth } from "./store/authAtoms"; // Custom auth hook
import { ROUTES } from "../../app/routes.ts"; // Route constants
import { STUDENT_LOGINS } from "../../services/loginCredentials";

// Student login component
export const StudentLogin = () => {
  const navigate = useNavigate(); // Enables navigation after successful login
  const { login, loading, error: authError } = useAuth(); // Get login function, loading state and error from custom auth hook

  // State for user input and errors
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(""); // Shown when fields are empty
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form reload behavior
    setFormError(""); // Clear any previous form errors

    // Simple client-side validation
    if (!username || !password) {
      setFormError("Please enter both student ID and password");
      return;
    }

    try {
      // Call the login function with role 'student'
      console.log("Attempting login with:", {
        username,
        password,
        role: "student",
      });
      await login({ username, password, role: "student" });

      // Only navigate if login was successful (no errors)
      if (!authError) {
        console.log("Login successful, navigating to dashboard");
        // Navigate to dashboard on success
        navigate(ROUTES.DASHBOARD);
      } else {
        console.error("Login error from authError:", authError);
        setFormError(authError);
      }
    } catch (err) {
      // Errors (like wrong credentials) are handled in the login function itself
      console.error("Login error from catch:", err);
      setFormError("Login failed. Please try again.");
    }
  };

  // Toggle debug info display
  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        {/* Title */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Student Login
          </h2>
        </div>

        {/* Show error if any */}
        {(formError || authError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {formError || authError}
          </div>
        )}

        {/* Login form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Username input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Student ID
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Password input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading} // Disable while loading
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {/* Show loading spinner if logging in */}
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Debug Info Toggle Button */}
        <div className="mt-4 text-center">
          <button
            onClick={toggleDebugInfo}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
          </button>
        </div>

        {/* Debug Info Panel */}
        {showDebugInfo && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md text-xs">
            <h3 className="font-semibold mb-2">Available Student Logins:</h3>
            <ul className="space-y-2">
              {STUDENT_LOGINS.map((student) => (
                <li key={student.username} className="flex justify-between">
                  <span>
                    Username: <strong>{student.username}</strong>
                  </span>
                  <span>
                    Password: <strong>{student.password}</strong>
                  </span>
                </li>
              ))}
            </ul> 
          </div>
        )}
      </div>
    </div>
  );
};
