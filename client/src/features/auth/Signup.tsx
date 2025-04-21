// // Ommitted Page
// // Create Signup for user 
// // For Faculty AutoSelect Role
// import React, { useState } from "react"; 
// import { useNavigate } from "react-router-dom"; // For programmatic navigation after successful signup
// import { GraduationCap } from "lucide-react"; // Icon from lucide-react 
// import { useAuth } from "./store/authAtoms"; // Custom auth hook for signup function
// import { Role } from "../types"; // User roles: "dean", "hod", or "supervisor"
// import { ROUTES } from "../../app/routes"; // Centralized route constants

// // Signup form component
// export const SignupPage = () => {
//   const navigate = useNavigate(); // Used to redirect user after signup
//   const { signup } = useAuth(); // Custom hook provides signup function

//   // Form state variables for controlled inputs
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setRole] = useState<Role>("dean"); // Default role set to "dean"
//   const [error, setError] = useState(""); // Error message shown to the user if passwords don't match

//   // Handles form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); // Prevents default form reload behavior

//     // Simple password confirmation check
//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       // Attempt to create a new user using signup function
//       await signup({
//         username,
//         password,
//         firstName: "", // These values are placeholders (you can make these fields later)
//         lastName: "",
//         email: "",
//         role: role as Role,
//       });

//       // Redirect user to the dashboard after successful signup
//       navigate(ROUTES.DASHBOARD);
//     } catch (err) {
//       // Log and optionally display error
//       console.error("Signup error:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         {/* Icon at the top of the form */}
//         <div className="flex justify-center mb-6">
//           <GraduationCap className="w-12 h-12 text-purple-600" />
//         </div>

//         <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

//         {/* Display error if it exists */}
//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//         {/* Signup form */}
//         <form onSubmit={handleSubmit}>
//           {/* Username field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Username
//             </label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)} // Updates state on user input
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               required
//             />
//           </div>

//           {/* Password field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               required
//             />
//           </div>

//           {/* Confirm password field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               required
//             />
//           </div>

//           {/* Role selection */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Role
//             </label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value as Role)} // Type cast to Role enum
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="dean">Dean</option>
//               <option value="supervisor">Supervisor</option>
//               <option value="hod">HOD</option>
//             </select>
//           </div>

//           {/* Submit button */}
//           <button
//             type="submit"
//             className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
//           >
//             Sign Up
//           </button>
//         </form>

//         {/* Link to login page if user already has an account */}
//         <p className="mt-4 text-center text-sm text-gray-600">
//           Already have an account?{" "}
//           <a
//             href={ROUTES.FACULTY_LOGIN}
//             className="text-purple-600 hover:text-purple-700"
//           >
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };
