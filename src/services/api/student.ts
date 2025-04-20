import { httpClient } from '../httpClient';
import { Student } from '../../features/types/schema';

const ENDPOINTS = {
  BASE: '/students',
  DETAIL: (id: string) => `/students/${id}`,
  BY_SUPERVISOR: (facultyId: string) => `/students/supervisor/${facultyId}`,
  BY_DEPARTMENT: (department: string) => `/students/department/${department}`,
  SCHOLARSHIP: (studentId: string) => `/students/${studentId}/scholarships`,
};

// Mock data for development and testing
const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    enroll: 'ENR001',
    registration: 'REG001',
    user: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '1234567890',
    address: '123 Main St, City',
    department: 'Computer Science',
    course: 'B.Tech',
    university: 'NIT Srinagar',
    joining_date: '2022-08-15',
    supervisor: 'f2', // Dr. Priya Patel
    scholarship_basic: 8000,
    scholarship_hra: 2000,
  },
  {
    id: '2',
    enroll: 'ENR002',
    registration: 'REG002',
    user: 'user2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone_number: '9876543210',
    address: '456 Oak Ave, Town',
    department: 'Electrical Engineering',
    course: 'M.Tech',
    university: 'NIT Srinagar',
    joining_date: '2022-07-10',
    supervisor: 'f5', // Dr. Vikram Singh
    scholarship_basic: 10000,
    scholarship_hra: 2500,
  },
  {
    id: '3',
    enroll: 'ENR003',
    registration: 'REG003',
    user: 'user3',
    name: 'Raj Kumar',
    email: 'raj.kumar@example.com',
    phone_number: '8765432109',
    address: '789 Pine Rd, Village',
    department: 'Computer Science',
    course: 'PhD',
    university: 'NIT Srinagar',
    joining_date: '2021-09-01',
    supervisor: 'f3', // Dr. Rajesh Kumar
    scholarship_basic: 15000,
    scholarship_hra: 3000,
  },
  {
    id: '4',
    enroll: 'ENR004',
    registration: 'REG004',
    user: 'user4',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone_number: '7654321098',
    address: '101 Elm St, City',
    department: 'Mechanical Engineering',
    course: 'M.Tech',
    university: 'NIT Srinagar',
    joining_date: '2022-01-15',
    supervisor: 'f7', // Dr. Neha Verma
    scholarship_basic: 10000,
    scholarship_hra: 2500,
  },
  {
    id: '5',
    enroll: 'ENR005',
    registration: 'REG005',
    user: 'user5',
    name: 'Amit Singh',
    email: 'amit.singh@example.com',
    phone_number: '6543210987',
    address: '202 Cedar Ave, Town',
    department: 'Civil Engineering',
    course: 'B.Tech',
    university: 'NIT Srinagar',
    joining_date: '2022-08-01',
    supervisor: 'f9', // Dr. Divya Joshi
    scholarship_basic: 8000,
    scholarship_hra: 2000,
  },
  {
    id: '6',
    enroll: 'ENR006',
    registration: 'REG006',
    user: 'user6',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    phone_number: '5432109876',
    address: '303 Birch Rd, Village',
    department: 'Electrical Engineering',
    course: 'PhD',
    university: 'NIT Srinagar',
    joining_date: '2021-07-20',
    supervisor: 'f5', // Dr. Vikram Singh
    scholarship_basic: 15000,
    scholarship_hra: 3000,
  },
  {
    id: '7',
    enroll: 'ENR007',
    registration: 'REG007',
    user: 'user7',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone_number: '4321098765',
    address: '404 Willow St, City',
    department: 'Computer Science',
    course: 'M.Tech',
    university: 'NIT Srinagar',
    joining_date: '2022-06-10',
    supervisor: 'f2', // Dr. Priya Patel
    scholarship_basic: 10000,
    scholarship_hra: 2500,
  },
  {
    id: '8',
    enroll: 'ENR008',
    registration: 'REG008',
    user: 'user8',
    name: 'Kiran Joshi',
    email: 'kiran.joshi@example.com',
    phone_number: '3210987654',
    address: '505 Maple Ave, Town',
    department: 'Chemical Engineering',
    course: 'B.Tech',
    university: 'NIT Srinagar',
    joining_date: '2022-08-25',
    supervisor: 'f10', // Dr. Anjali Desai
    scholarship_basic: 8000,
    scholarship_hra: 2000,
  },
];

// Environment flag to use mock data
const USE_MOCK_DATA = true; // Change to false when API is ready

/**
 * Student API Service
 * Handles all student-related API interactions
 */
class StudentService {
  /**
   * Get all students
   */
  async getAllStudents(): Promise<Student[]> {
    if (USE_MOCK_DATA) {
      console.log('Using mock student data');
      return Promise.resolve(MOCK_STUDENTS);
    }
    return httpClient.get<Student[]>(ENDPOINTS.BASE);
  }

  /**
   * Get student by ID
   */
  async getStudentById(id: string): Promise<Student> {
    if (USE_MOCK_DATA) {
      const student = MOCK_STUDENTS.find(s => s.id === id);
      if (!student) {
        throw new Error(`Student with ID ${id} not found`);
      }
      return Promise.resolve(student);
    }
    return httpClient.get<Student>(ENDPOINTS.DETAIL(id));
  }

  /**
   * Get students by supervisor
   */
  async getStudentsBySupervisor(facultyId: string): Promise<Student[]> {
    if (USE_MOCK_DATA) {
      // Filter mock students by supervisor
      const students = MOCK_STUDENTS.filter(s => s.supervisor === facultyId);
      return Promise.resolve(students);
    }
    return httpClient.get<Student[]>(ENDPOINTS.BY_SUPERVISOR(facultyId));
  }

  /**
   * Get students by department
   */
  async getStudentsByDepartment(department: string): Promise<Student[]> {
    if (USE_MOCK_DATA) {
      // Filter mock students by department
      const students = MOCK_STUDENTS.filter(s => s.department === department);
      return Promise.resolve(students);
    }
    return httpClient.get<Student[]>(ENDPOINTS.BY_DEPARTMENT(department));
  }

  /**
   * Create a new student
   */
  async createStudent(student: Omit<Student, 'id'>): Promise<Student> {
    if (USE_MOCK_DATA) {
      // Creating mock student with generated ID
      const newStudent = {
        ...student,
        id: `${Date.now()}`, // Generate a unique ID
      };
      MOCK_STUDENTS.push(newStudent);
      return Promise.resolve(newStudent);
    }
    return httpClient.post<Student>(ENDPOINTS.BASE, student);
  }

  /**
   * Update student information
   */
  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    if (USE_MOCK_DATA) {
      const index = MOCK_STUDENTS.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error(`Student with ID ${id} not found`);
      }
      MOCK_STUDENTS[index] = { ...MOCK_STUDENTS[index], ...student };
      return Promise.resolve(MOCK_STUDENTS[index]);
    }
    return httpClient.put<Student>(ENDPOINTS.DETAIL(id), student);
  }

  /**
   * Delete student
   */
  async deleteStudent(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      const index = MOCK_STUDENTS.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error(`Student with ID ${id} not found`);
      }
      MOCK_STUDENTS.splice(index, 1);
      return Promise.resolve();
    }
    return httpClient.delete<void>(ENDPOINTS.DETAIL(id));
  }

  /**
   * Get student scholarships
   */
  async getStudentScholarships(studentId: string): Promise<unknown[]> {
    if (USE_MOCK_DATA) {
      // Return empty array for mock data
      return Promise.resolve([]);
    }
    return httpClient.get<unknown[]>(ENDPOINTS.SCHOLARSHIP(studentId));
  }
}

export const studentService = new StudentService();