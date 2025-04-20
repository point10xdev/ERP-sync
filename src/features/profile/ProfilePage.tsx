import { useEffect, useState } from "react";
import { useAuth } from "../auth/authAtoms";
import { Faculty, Student } from "../types/schema";
import { facultyService, studentService } from "../../services/api";
import { ScholarshipInfo } from "./ScholarshipInfo";

export const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [facultyData, setFacultyData] = useState<Faculty | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        if (user.role === "student") {
          // Fetch student data
          // In a real app, you'd have a way to map auth user to student records
          const students = await studentService.getAllStudents();
          const matchedStudent = students.find((s) => s.user === user.username);
          if (matchedStudent) {
            setStudentData(matchedStudent);
          }
        } else {
          // Fetch faculty data for dean, supervisor, hod
          // In a real app, you'd have a way to map auth user to faculty records
          const faculty = await facultyService.getAllFaculty();
          const matchedFaculty = faculty.find((f) => f.user === user.username);
          if (matchedFaculty) {
            setFacultyData(matchedFaculty);
          }
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const renderFacultyProfile = () => {
    if (!facultyData) return null;

    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {facultyData.name}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {facultyData.email}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {facultyData.phone_number}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {facultyData.department}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Designation
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {facultyData.designation}
          </div>
        </div>
      </>
    );
  };

  const renderStudentProfile = () => {
    if (!studentData) return null;

    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {studentData.name}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {studentData.email}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enrollment
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {studentData.enroll}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Registration
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {studentData.registration}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {studentData.phone_number}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {studentData.department}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {studentData.course}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            University
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {studentData.university}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Joined
          </label>
          <div className="mt-1 p-2 bg-gray-50 rounded-md">
            {new Date(studentData.joining_date).toLocaleDateString()}
          </div>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
              {user?.username}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md capitalize">
              {user?.role}
            </div>
          </div>

          {user?.role === "student"
            ? renderStudentProfile()
            : renderFacultyProfile()}

          {/* Profile picture */}
          {(facultyData?.profile_pic || studentData?.profile_pic) && (
            <div className="mt-6">
              <img
                src={facultyData?.profile_pic || studentData?.profile_pic}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          )}

          {/* Scholarship Info for students */}
          {user?.role === "student" && studentData && (
            <ScholarshipInfo studentId={studentData.id} />
          )}
        </div>
      </div>
    </div>
  );
};
