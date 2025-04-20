import React from 'react';
import { StudentList } from './StudentList';
import { useAuth } from '../auth/AuthContext';

export const MyStudentsPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Students</h1>
      <StudentList />
    </div>
  );
};