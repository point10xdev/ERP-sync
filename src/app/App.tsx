// Destructuring import from react-router-dom with aliasing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Provides auth context to the app
import { AuthProvider } from "../features/auth/AuthContext";
// Route guard for protected routes
import { PrivateRoute } from "../shared/components/PrivateRoute";

import { DashboardLayout } from "../shared/components/layouts";
import { FacultyLogin, SignupPage, StudentLogin } from "../features/auth";
import { HomePage } from "../features/dashboard";
import { SupervisorPage } from "../features/supervisor";
import { MyStudentsPage } from "../features/students";
import { ProfilePage } from "../features/profile";
import { CurrentScholarship, PreviousScholarships } from "../features/students/scholarship";
import { LandingPage } from "../features/auth/LandingPage";
import { DepartmentFaculty } from "../features/faculty";
import { ROUTES } from "./routes";

function App() {
  return (
    // Wrap entire app with AuthProvider to provide authentication context
    <AuthProvider>
      {/* Set up routing using react-router */}
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path={ROUTES.FACULTY_LOGIN} element={<FacultyLogin />} />
          <Route path={ROUTES.STUDENT_LOGIN} element={<StudentLogin />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard/*"
            element={
              // Protect dashboard routes (only accessible when authenticated)
              <PrivateRoute>
                {/* Dashboard layout with nested routes */}
                <DashboardLayout>
                  <Routes>
                    {/* Dashboard home */}
                    <Route path="/" element={<HomePage />} />

                    {/* User profile page */}
                    <Route path="/my-profile" element={<ProfilePage />} />

                    {/* My Students - accessible by dean, supervisor, hod */}
                    <Route
                      path="/my-students"
                      element={
                        <PrivateRoute
                          allowedRoles={["dean", "supervisor", "hod"]}
                        >
                          <MyStudentsPage />
                        </PrivateRoute>
                      }
                    />

                    {/* Supervisor section - accessible by dean and supervisor */}
                    <Route
                      path="/supervisor/*"
                      element={
                        <PrivateRoute allowedRoles={["supervisor"]}>
                          <SupervisorPage />
                        </PrivateRoute>
                      }
                    />

                    {/* Current scholarship - accessible by students */}
                    <Route
                      path="/scholarship/current"
                      element={
                        <PrivateRoute allowedRoles={["student"]}>
                          <CurrentScholarship />
                        </PrivateRoute>
                      }
                    />

                    {/* Previous scholarships - accessible by students */}
                    <Route
                      path="/scholarship/previous"
                      element={
                        <PrivateRoute allowedRoles={["student"]}>
                          <PreviousScholarships />
                        </PrivateRoute>
                      }
                    />

                    {/* Department faculty management - accessible by HOD */}
                    <Route
                      path="/department-faculty"
                      element={
                        <PrivateRoute allowedRoles={["hod"]}>
                          <DepartmentFaculty />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
