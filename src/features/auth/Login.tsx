import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Loader } from "lucide-react";
import { useAuth } from "./authAtoms";
import { ROUTES } from "../../utils/constants/routes";
import { Role } from "../types";
import { authService } from "../../services/api/auth";

export const FacultyLogin = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("dean");
  const [formError, setFormError] = useState("");
  const [availableUsers, setAvailableUsers] = useState<
    Array<{ username: string; role: string; name: string }>
  >([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Fetch available users when component mounts
  useEffect(() => {
    const users = authService.getAvailableUsers();
    setAvailableUsers(users);

    // Set default selection to dean
    const defaultUser = users.find((user) => user.role === "dean");
    if (defaultUser) {
      setSelectedUser(defaultUser.username);
      setUsername(defaultUser.username);
      setPassword("password123"); // Default password for all users
      setRole(defaultUser.role as Role);
    }
  }, []);

  // Handle user selection change
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const username = e.target.value;
    setSelectedUser(username);
    setUsername(username);

    // Find the selected user's role
    const user = availableUsers.find((u) => u.username === username);
    if (user) {
      setRole(user.role as Role);
    }

    // Reset password to default
    setPassword("password123");

    // Clear any form errors
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setFormError("Please enter both username and password");
      return;
    }

    try {
      // Create credentials object as expected by the login function
      const credentials = { username, password, role };
      await login(credentials);
      // Navigate to dashboard after successful login
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          <GraduationCap className="w-12 h-12 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">
          Login to Dashboard
        </h1>
        {formError && (
          <p className="text-red-500 text-center mb-4">{formError}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select User
            </label>
            <select
              value={selectedUser}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- Select a user --</option>
              <optgroup label="Dean">
                {availableUsers
                  .filter((u) => u.role === "dean")
                  .map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.name} ({user.role})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="HODs">
                {availableUsers
                  .filter((u) => u.role === "hod")
                  .map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.name} ({user.role})
                    </option>
                  ))}
              </optgroup>
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
              Default password is: password123
            </p>
          </div>
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
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>This is a demo application.</p>
          <p>Please use the dropdown to select a predefined user account.</p>
        </div>
      </div>
    </div>
  );
};
