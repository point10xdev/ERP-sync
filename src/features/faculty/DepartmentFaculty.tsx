import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Faculty } from "../types/schema";
import { MOCK_FACULTY_DATA } from "./mockFacultyData";

const DepartmentFaculty: React.FC = () => {
  const { user } = useAuth();

  // Filter faculty members by the HOD's department
  const departmentFaculty = MOCK_FACULTY_DATA.filter(
    (faculty: Faculty) => faculty.department === user?.department
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">
        Department Faculty Members
      </h1>

      {user?.department && (
        <p className="mb-4 text-gray-600">
          Showing faculty members for {user.department} department
        </p>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Designation
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departmentFaculty.length > 0 ? (
              departmentFaculty.map((faculty: Faculty) => (
                <tr key={faculty.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {faculty.profile_pic ? (
                        <img
                          className="h-10 w-10 rounded-full mr-4"
                          src={faculty.profile_pic}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                          <span className="text-gray-500 font-medium">
                            {faculty.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {faculty.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faculty.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faculty.phone_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faculty.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faculty.role}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {user?.department
                    ? `No faculty members found in ${user.department} department`
                    : "No department assigned to your account"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentFaculty;
