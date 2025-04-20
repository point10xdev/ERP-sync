import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, UserCircle, GraduationCap, ChevronLeft, ChevronRight, Wallet, History } from 'lucide-react';
import { useAuth } from '../../../features/auth/AuthContext';
import { ROUTES } from '../../../app/routes';

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  // slidebar toggle state
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => {
    // For home/dashboard, check exact match
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === ROUTES.DASHBOARD ? 'bg-blue-100' : '';
    }
    // For other routes, use startsWith to include sub-routes
    return location.pathname.startsWith(path) ? 'bg-blue-100' : '';
  };

  // Check if user is a student
  const isStudent = user?.role === 'student';
  
  // Only faculty roles can access My Students
  const canAccessMyStudents = !isStudent && (user?.role === 'dean' || 
                                            user?.role === 'supervisor' || 
                                            user?.role === 'hod');
  
  // Only dean and supervisor can access supervisor section
  const canAccessSupervisor = user?.role === 'dean' || user?.role === 'supervisor';

  return (
    <div 
      className={`bg-white border-r h-screen transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex justify-between items-center p-4">
        {!isCollapsed && (
          <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2">
            <Home className="w-6 h-6 text-purple-600" />
            <span className="text-purple-600 font-medium text-sm">National Institute Of Technology , Srinagar</span>
          </Link>
        )}
        {isCollapsed && (
          <Link to={ROUTES.DASHBOARD} className="mx-auto">
            <Home className="w-6 h-6 text-purple-600" />
          </Link>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          {isCollapsed ? 
            <ChevronRight className="w-5 h-5 text-gray-500" /> : 
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          }
        </button>
      </div>

      <nav className="mt-8 px-4 flex-1">
        <Link 
          to={ROUTES.DASHBOARD} 
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} p-3 rounded-lg mb-2 ${isActive(ROUTES.DASHBOARD)}`}
          title="Home"
        >
          <Home className="w-5 h-5" />
          {!isCollapsed && <span>Home</span>}
        </Link>
        
        <Link 
          to={ROUTES.MY_PROFILE} 
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} p-3 rounded-lg mb-2 ${isActive(ROUTES.MY_PROFILE)}`}
          title="My Profile"
        >
          <UserCircle className="w-5 h-5" />
          {!isCollapsed && <span>My Profile</span>}
        </Link>
        
        {canAccessMyStudents && (
          <Link 
            to={ROUTES.MY_STUDENTS} 
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} p-3 rounded-lg mb-2 ${isActive(ROUTES.MY_STUDENTS)}`}
            title="My Students"
          >
            <GraduationCap className="w-5 h-5" />
            {!isCollapsed && <span>My Students</span>}
          </Link>
        )}
        
        {canAccessSupervisor && (
          <Link 
            to={ROUTES.SUPERVISOR} 
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} p-3 rounded-lg mb-2 ${isActive(ROUTES.SUPERVISOR)}`}
            title="Supervisor"
          >
            <Users className="w-5 h-5" />
            {!isCollapsed && <span>Supervisor</span>}
          </Link>
        )}
        
        {isStudent && (
          <>
            <Link 
              to={ROUTES.CURRENT_SCHOLARSHIP} 
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} p-3 rounded-lg mb-2 ${isActive(ROUTES.CURRENT_SCHOLARSHIP)}`}
              title="Current Scholarship"
            >
              <Wallet className="w-5 h-5" />
              {!isCollapsed && <span>Current Scholarship</span>}
            </Link>
            
            <Link 
              to={ROUTES.PREVIOUS_SCHOLARSHIPS} 
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} p-3 rounded-lg mb-2 ${isActive(ROUTES.PREVIOUS_SCHOLARSHIPS)}`}
              title="Previous Scholarships"
            >
              <History className="w-5 h-5" />
              {!isCollapsed && <span>Previous Scholarships</span>}
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};