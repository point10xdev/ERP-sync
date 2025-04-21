import React from "react";
import { StudentList } from "./StudentList";
import { useAuth } from "../auth/store/authAtoms";

export const MyStudentsPage = () => {
  // Get user object for department filtering or other logic if needed later
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">My Students</h1>
      {user?.department && (
        <p className="mb-4 text-gray-600">
          Showing students for {user.department} department
        </p>
      )}
      <StudentList />
    </div>
  );
};
