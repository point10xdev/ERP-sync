import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../../app/routes';
import { ClipboardCheck, BookOpen, Calendar } from 'lucide-react';

type ActionColor = 'green' | 'indigo' | 'purple';

interface ActionItem {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  color: ActionColor;
}

export const SupervisorPage = () => {
  const actions: ActionItem[] = [
    { 
      title: 'Student Verification', 
      description: 'Verify student registrations and approve enrollment requests',
      link: ROUTES.STUDENT_VERIFICATION,
      icon: <ClipboardCheck className="w-5 h-5 text-green-500" />,
      color: 'green'
    },
    { 
      title: 'Subject Assignment', 
      description: 'Assign subjects to faculty members and manage teaching allocations',
      link: ROUTES.SUBJECT_ASSIGNMENT,
      icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
      color: 'indigo'
    },
    { 
      title: 'Semester Open/Close', 
      description: 'Manage academic calendar and control semester transitions',
      link: ROUTES.SEMESTER,
      icon: <Calendar className="w-5 h-5 text-purple-500" />,
      color: 'purple'
    },
  ];

  // Function to get color classes based on the action's color
  const getColorClasses = (color: ActionColor) => {
    const colors = {
      green: {
        bg: 'bg-green-50 hover:bg-green-100',
        text: 'text-green-700',
        border: 'border-green-100'
      },
      indigo: {
        bg: 'bg-indigo-50 hover:bg-indigo-100',
        text: 'text-indigo-700',
        border: 'border-indigo-100'
      },
      purple: {
        bg: 'bg-purple-50 hover:bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-100'
      }
    };
    return colors[color];
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Supervisor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => {
          const colorClasses = getColorClasses(action.color);
          
          return (
            <Link
              key={action.title}
              to={action.link}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-lg ${colorClasses.bg} mr-3`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{action.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-6">{action.description}</p>
                <div className={`mt-auto pt-3 border-t ${colorClasses.border}`}>
                  <div className={`${colorClasses.bg} ${colorClasses.text} py-2 px-4 rounded-lg flex items-center justify-center`}>
                    <span>Manage</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};