import { httpClient } from '../httpClient';
import { Faculty } from '../../features/types/schema';

const ENDPOINTS = {
  BASE: '/faculty',
  DETAIL: (id: string) => `/faculty/${id}`,
  STUDENTS: (id: string) => `/faculty/${id}/students`,
};

/**
 * Faculty API Service
 * Handles all faculty-related API interactions
 */
class FacultyService {
  /**
   * Get all faculty members
   */
  async getAllFaculty(): Promise<Faculty[]> {
    return httpClient.get<Faculty[]>(ENDPOINTS.BASE);
  }

  /**
   * Get faculty by ID
   */
  async getFacultyById(id: string): Promise<Faculty> {
    return httpClient.get<Faculty>(ENDPOINTS.DETAIL(id));
  }

  /**
   * Create a new faculty
   */
  async createFaculty(faculty: Omit<Faculty, 'id'>): Promise<Faculty> {
    return httpClient.post<Faculty>(ENDPOINTS.BASE, faculty);
  }

  /**
   * Update faculty information
   */
  async updateFaculty(id: string, faculty: Partial<Faculty>): Promise<Faculty> {
    return httpClient.put<Faculty>(ENDPOINTS.DETAIL(id), faculty);
  }

  /**
   * Delete faculty
   */
  async deleteFaculty(id: string): Promise<void> {
    return httpClient.delete<void>(ENDPOINTS.DETAIL(id));
  }

  /**
   * Get students supervised by a faculty
   */
  async getFacultyStudents(id: string): Promise<any[]> {
    return httpClient.get<any[]>(ENDPOINTS.STUDENTS(id));
  }
}

export const facultyService = new FacultyService(); 