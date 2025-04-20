import { Link } from 'react-router-dom';
import { ROUTES } from '../../common/constants/routes';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';

export const LandingPage = () => {
  const { isAuthenticated, logout } = useAuth();
  
  // If user is already authenticated, log them out first
  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to ERP Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please select your login type
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            to={ROUTES.FACULTY_LOGIN}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Faculty Login
          </Link>
          <Link
            to={ROUTES.STUDENT_LOGIN}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};
