import { Faculty, Student } from '../../features/types/schema';
import { MOCK_FACULTY_DATA } from '../../features/faculty/mockFacultyData';

/**
 * Faculty API Service
 * Handles all faculty-related API interactions
 * 
 * MOCK IMPLEMENTATION:
 * This service uses mock data instead of real API calls for development purposes
 */
class FacultyService {
  /**
   * Get all faculty members
   */
  async getAllFaculty(): Promise<Faculty[]> {
    // Mock implementation returning all faculty members
    console.log('[MOCK API] Fetching all faculty members');
    return Promise.resolve(MOCK_FACULTY_DATA);
  }

  /**
   * Get faculty by ID
   */
  async getFacultyById(id: string): Promise<Faculty> {
    console.log(`[MOCK API] Fetching faculty with ID: ${id}`);

    // Find faculty with the provided ID
    const faculty = MOCK_FACULTY_DATA.find(f => f.id === id);

    if (!faculty) {
      return Promise.reject(new Error(`Faculty with ID ${id} not found`));
    }

    return Promise.resolve(faculty);
  }

  /**
   * Get faculty by username
   */
  async getFacultyByUsername(username: string): Promise<Faculty> {
    console.log(`[MOCK API] Fetching faculty with username: ${username}`);

    // Find faculty with the provided username
    const faculty = MOCK_FACULTY_DATA.find(f => f.user === username);

    if (!faculty) {
      return Promise.reject(new Error(`Faculty with username ${username} not found`));
    }

    return Promise.resolve(faculty);
  }

  /**
   * Create a new faculty
   */
  async createFaculty(faculty: Omit<Faculty, 'id'>): Promise<Faculty> {
    console.log('[MOCK API] Creating new faculty (not implemented in mock)');
    // This is a mock and would not actually create a new faculty
    return Promise.resolve({
      ...faculty,
      id: `f${MOCK_FACULTY_DATA.length + 1}` // Generate a mock ID
    } as Faculty);
  }

  /**
   * Update faculty information
   */
  async updateFaculty(id: string, faculty: Partial<Faculty>): Promise<Faculty> {
    console.log(`[MOCK API] Updating faculty with ID: ${id} (not implemented in mock)`);
    // Find the faculty to update
    const existingFaculty = MOCK_FACULTY_DATA.find(f => f.id === id);

    if (!existingFaculty) {
      return Promise.reject(new Error(`Faculty with ID ${id} not found`));
    }

    // Return a merged object (in a real app, this would update the database)
    return Promise.resolve({
      ...existingFaculty,
      ...faculty
    });
  }

  /**
   * Delete faculty
   */
  async deleteFaculty(id: string): Promise<void> {
    console.log(`[MOCK API] Deleting faculty with ID: ${id} (not implemented in mock)`);
    // This is a mock and would not actually delete a faculty
    return Promise.resolve();
  }

  /**
   * Get students supervised by a faculty
   */
  async getFacultyStudents(id: string): Promise<Student[]> {
    console.log(`[MOCK API] Fetching students supervised by faculty with ID: ${id}`);

    // Find the faculty
    const faculty = MOCK_FACULTY_DATA.find(f => f.id === id);

    if (!faculty) {
      return Promise.reject(new Error(`Faculty with ID ${id} not found`));
    }

    // Return an empty array for now - in a real app, would fetch data from API
    return Promise.resolve([]);
  }
}

export const facultyService = new FacultyService(); 