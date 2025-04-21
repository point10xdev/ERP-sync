import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Loader } from "lucide-react"; // Icons for UI
import { useAuth } from "./store/authAtoms"; // Custom hook to access auth context
import { ROUTES } from "../../app/routes"; 
import { Role } from "../types"; 
import { authService } from "../../services/api/auth"; // Mock service to fetch users


// ---------- Component: FacultyLogin ----------
export const FacultyLogin = () => {
  const navigate = useNavigate();

  // Destructure login function and loading state from custom auth hook
  const { login, loading } = useAuth();


  // -----------------------------
  // State management
  // -----------------------------
  const [username, setUsername] = useState(""); // Selected username
  const [password, setPassword] = useState(""); // Password (default: password123)
  const [role, setRole] = useState<Role>("dean"); // User role: dean/hod/supervisor
  const [formError, setFormError] = useState(""); // Validation or login error

  
  // List of predefined users (mocked for demo)
  const [availableUsers, setAvailableUsers] = useState<
    Array<{ username: string; role: string; name: string }>
  >([]);

  const [selectedUser, setSelectedUser] = useState(""); // For dropdown selection

  // -----------------------------
  // Side Effect: Fetch users on mount
  // -----------------------------
  useEffect(() => {
    const users = authService.getAvailableUsers(); // Returns mock users
    setAvailableUsers(users);

    // Automatically select the first user with role "dean" as default
    const defaultUser = users.find((user) => user.role === "dean");
    if (defaultUser) {
      setSelectedUser(defaultUser.username);
      setUsername(defaultUser.username);
      setPassword("password123"); // Default password for demo users
      setRole(defaultUser.role as Role);
    }
  }, []);

  // -----------------------------
  // Handler: When user changes selection in dropdown
  // -----------------------------
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const username = e.target.value;
    setSelectedUser(username);
    setUsername(username);

    // Get user role based on selected username
    const user = availableUsers.find((u) => u.username === username);
    if (user) {
      setRole(user.role as Role);
    }

    // Reset password and error
    setPassword("password123");
    setFormError("");
  };

  // -----------------------------
  // Handler: Form submission
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setFormError("Please enter both username and password");
      return;
    }

    try {
      // Attempt login
      await login({ username, password, role });

      // Redirect to dashboard on success
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // Display error message if login fails
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Login failed. Please try again.");
      }
    }
  };

  // -----------------------------
  // UI: Form + Dropdown + Inputs
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {/* App Icon */}
        <div className="flex justify-center mb-6">
          <GraduationCap className="w-12 h-12 text-purple-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Login to Dashboard
        </h1>

        {/* Error message */}
        {formError && (
          <p className="text-red-500 text-center mb-4">{formError}</p>
        )}

        {/* Form Start */}
        <form onSubmit={handleSubmit}>
          {/* Select User */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select User
            </label>
            <select
              value={selectedUser}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">-- Select a user --</option>

              {/* Dean users */}
              <optgroup label="Dean">
                {availableUsers
                  .filter((u) => u.role === "dean")
                  .map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.name} ({user.role})
                    </option>
                  ))}
              </optgroup>

              {/* HOD users */}
              <optgroup label="HODs">
                {availableUsers
                  .filter((u) => u.role === "hod")
                  .map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.name} ({user.role})
                    </option>
                  ))}
              </optgroup>

              {/* Supervisor users */}
              <optgroup label="Supervisors">
                {availableUsers
                  .filter((u) => u.role === "supervisor")
                  .map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.name} ({user.role})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Username Field (readonly) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Default password is: <code>password123</code>
            </p>
          </div>

          {/* Role Display (readonly) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={role}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !username}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Help text */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>This is a demo application.</p>
          <p>Please use the dropdown to select a predefined user account.</p>
        </div>
      </div>
    </div>
  );
};
