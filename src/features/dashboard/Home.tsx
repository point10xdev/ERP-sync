import React from 'react';
import { useAuth } from '../../features/auth/AuthContext';

export const HomePage = () => {
  const { user } = useAuth();
  return <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>;
};