import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Student, SystemRole } from "../types/schema";
import { studentService } from "../../services/api";
import { MOCK_FACULTY_DATA } from "../faculty/mockFacultyData";
import {
  loginAsDean,
  loginAsHOD,
  loginAsSupervisor,
  loginWithUsername,
} from "../../services/testLoginHelper";
import {
  DEAN_LOGIN,
  HOD_LOGINS,
  SUPERVISOR_LOGINS,
} from "../../services/loginCredentials";

// Extended User interface to include course
interface ExtendedUser {
  username: string;
  role: SystemRole;
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  course?: string; // For supervisor users
  profileImageUrl?: string;
  designation?: string;
  lastLogin?: Date;
}

export const StudentList = () => {
  const { user } = useAuth();
  const extendedUser = user as ExtendedUser; // Cast user to our extended interface

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedUsername, setSelectedUsername] = useState("");

  // Debug: Log current user
  console.log("Current user:", extendedUser);
  console.log("Available faculty data:", MOCK_FACULTY_DATA);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        let studentData: Student[] = [];

        // First get all students
        const allStudents = await studentService.getAllStudents();
        console.log("All students:", allStudents);

        // Fallback - show all students by default
        studentData = allStudents;

        // Filter based on user role
        if (extendedUser?.role === "supervisor") {
          console.log("User is a supervisor, filtering students...");

          // For debug and testing: Use all supervisor IDs if user can't be matched
          // This allows testing without a perfect user match
          let supervisorIds: string[] = [];

          // Find the faculty ID for the current user to use for filtering
          const facultyUser = MOCK_FACULTY_DATA.find(
            (f) =>
              f.user === extendedUser.username || f.email === extendedUser.email
          );

          if (facultyUser) {
            console.log("Matched faculty:", facultyUser);
            supervisorIds = [facultyUser.id];
          } else {
            // For testing: Use all supervisor IDs from faculty with supervisor role
            supervisorIds = MOCK_FACULTY_DATA.filter(
              (f) => f.role === "supervisor"
            ).map((f) => f.id);
            console.log(
              "No faculty match found for user. Using all supervisor IDs for testing:",
              supervisorIds
            );
          }

          // Get students supervised by the relevant faculty
          studentData = allStudents.filter((student) =>
            supervisorIds.includes(student.supervisor || "")
          );

          console.log("Filtered students for supervisor:", studentData);
        } else if (extendedUser?.role === "hod") {
          console.log(
            "User is an HOD, filtering for department:",
            extendedUser.department
          );

          // HOD can see all students in their department
          if (extendedUser?.department) {
            studentData = allStudents.filter(
              (student) => student.department === extendedUser.department
            );
            console.log("Filtered students for HOD:", studentData);
          } else {
            console.log("HOD has no department set");
            setError("Department information not found for HOD");
          }
        } else if (extendedUser?.role === "dean") {
          console.log("User is a dean, showing all students");
          // Dean can see all students
          studentData = allStudents;
        } else {
          console.log("Unknown role or no role:", extendedUser?.role);
        }

        setStudents(studentData);

        // Extract unique departments for filtering
        const uniqueDepartments = [
          ...new Set(studentData.map((s) => s.department)),
        ];
        setDepartments(uniqueDepartments);
        console.log("Available departments for filtering:", uniqueDepartments);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [extendedUser]);

  // Filter students based on search term and department
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enroll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filterDepartment
      ? student.department === filterDepartment
      : true;

    return matchesSearch && matchesDepartment;
  });

  // Handle user selection
  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const username = e.target.value;
    if (username) {
      setSelectedUsername(username);
    }
  };

  // Handle login with selected user
  const handleLoginWithSelected = () => {
    if (selectedUsername) {
      loginWithUsername(selectedUsername);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Student Management</h2>

      {/* Role-specific heading */}
      <div className="mb-4">
        {extendedUser?.role === "supervisor" && (
          <p className="text-gray-600">
            Showing students under your supervision
            {extendedUser?.course && ` for ${extendedUser.course} course`}
          </p>
        )}
        {extendedUser?.role === "hod" && extendedUser?.department && (
          <p className="text-gray-600">
            Showing all students in the {extendedUser.department} department
          </p>
        )}
        {extendedUser?.role === "dean" && (
          <p className="text-gray-600">Showing all students in the college</p>
        )}
      </div>

      {/* Debug info for troubleshooting */}
      <div className="bg-gray-100 p-4 mb-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">
          Current user role: {extendedUser?.role || "Not set"}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Department: {extendedUser?.department || "Not set"}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Course (if supervisor): {extendedUser?.course || "Not set"}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          After filters: {filteredStudents.length} of {students.length} students
        </p>

        {/* User selection dropdown */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            value={selectedUsername}
            onChange={handleUserSelect}
            className="p-2 border rounded flex-grow"
          >
            <option value="">-- Select a user to login as --</option>
            <optgroup label="Dean">
              <option value={DEAN_LOGIN.username}>
                {DEAN_LOGIN.name} ({DEAN_LOGIN.department})
              </option>
            </optgroup>
            <optgroup label="HODs">
              {HOD_LOGINS.map((hod) => (
                <option key={hod.username} value={hod.username}>
                  {hod.name} ({hod.department})
                </option>
              ))}
            </optgroup>
            <optgroup label="Supervisors">
              {SUPERVISOR_LOGINS.map((sup) => (
                <option key={sup.username} value={sup.username}>
                  {sup.name} ({sup.department}, {sup.course})
                </option>
              ))}
            </optgroup>
          </select>
          <button
            onClick={handleLoginWithSelected}
            disabled={!selectedUsername}
            className={`px-4 py-2 rounded text-white ${
              selectedUsername
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Login with Selected User
          </button>
        </div>

        {/* Quick login buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loginAsDean}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Login as Dean
          </button>
          <button
            onClick={() => loginAsHOD("Computer Science")}
            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
          >
            Login as CS HOD
          </button>
          <button
            onClick={() => loginAsHOD("Electrical Engineering")}
            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
          >
            Login as EE HOD
          </button>
          <button
            onClick={() => loginAsSupervisor("Computer Science", "B.Tech")}
            className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
          >
            Login as CS B.Tech Supervisor
          </button>
          <button
            onClick={() => loginAsSupervisor("Computer Science", "PhD")}
            className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
          >
            Login as CS PhD Supervisor
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, enrollment, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student table */}
      {filteredStudents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Enrollment</th>
                <th className="py-2 px-4 border-b text-left">Department</th>
                <th className="py-2 px-4 border-b text-left">Course</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                {extendedUser?.role === "supervisor" && (
                  <th className="py-2 px-4 border-b text-left">Supervisor</th>
                )}
                <th className="py-2 px-4 border-b text-left">Scholarship</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{student.name}</td>
                  <td className="py-2 px-4 border-b">{student.enroll}</td>
                  <td className="py-2 px-4 border-b">{student.department}</td>
                  <td className="py-2 px-4 border-b">{student.course}</td>
                  <td className="py-2 px-4 border-b">{student.email}</td>
                  {extendedUser?.role === "supervisor" && (
                    <td className="py-2 px-4 border-b">
                      {MOCK_FACULTY_DATA.find(
                        (f) => f.id === student.supervisor
                      )?.name || "Not assigned"}
                    </td>
                  )}
                  <td className="py-2 px-4 border-b">
                    {student.scholarship_basic ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        None
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() =>
                        window.alert("View details (not implemented)")
                      }
                    >
                      View
                    </button>
                    {/* Display more actions based on user role */}
                    {(extendedUser?.role === "dean" ||
                      extendedUser?.role === "supervisor") && (
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() =>
                          window.alert("Manage scholarship (not implemented)")
                        }
                      >
                        Manage
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-700">
            No students found. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};
