import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthContext";
import { PrivateRoute } from "../common/components/PrivateRoute";
import { DashboardLayout } from "../common/components/layouts";
import { LoginPage, SignupPage, StudentLogin } from "../features/auth";
import { HomePage } from "../features/dashboard";
import { SupervisorPage } from "../features/supervisor";
import { MyStudentsPage } from "../features/students";
import { ProfilePage } from "../features/profile";
import {
  CurrentScholarship,
  PreviousScholarships,
} from "../features/students/scholarship";
import { LandingPage } from "../features/auth/LandingPage";
import { DepartmentFaculty } from "../features/faculty";
import { ROUTES } from "./routes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path={ROUTES.FACULTY_LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.STUDENT_LOGIN} element={<StudentLogin />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/my-profile" element={<ProfilePage />} />
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
                    <Route
                      path="/supervisor/*"
                      element={
                        <PrivateRoute allowedRoles={["dean", "supervisor"]}>
                          <SupervisorPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/scholarship/current"
                      element={
                        <PrivateRoute allowedRoles={["student"]}>
                          <CurrentScholarship />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/scholarship/previous"
                      element={
                        <PrivateRoute allowedRoles={["student"]}>
                          <PreviousScholarships />
                        </PrivateRoute>
                      }
                    />
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
