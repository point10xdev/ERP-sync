import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Student } from '../types/schema';
import { facultyService, studentService } from '../../services/api';

export const StudentList = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        let studentData: Student[] = [];

        // If the user is a supervisor, get their students
        if (user?.role === 'supervisor' as any) {
          // This would need the faculty ID, which might require another API call
          // For now, we'll just get all students as a fallback
          studentData = await studentService.getAllStudents();
        } else {
          // For supervisors, deans, etc., get all students or filter by department
          studentData = await studentService.getAllStudents();
        }

        setStudents(studentData);

        // Extract unique departments for filtering
        const uniqueDepartments = [...new Set(studentData.map(s => s.department))];
        setDepartments(uniqueDepartments);
      } catch (err) {
        setError('Failed to load students');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  // Filter students based on search term and department
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enroll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment ? student.department === filterDepartment : true;
    
    return matchesSearch && matchesDepartment;
  });

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
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
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
                      onClick={() => window.alert('View details (not implemented)')}
                    >
                      View
                    </button>
                    {/* Display more actions based on user role */}
                    {(user?.role === 'dean' || user?.role === 'supervisor') && (
                      <button 
                        className="text-green-600 hover:text-green-800"
                        onClick={() => window.alert('Manage scholarship (not implemented)')}
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
        <p>No students found. Try adjusting your search or filters.</p>
      )}
    </div>
  );
}; 