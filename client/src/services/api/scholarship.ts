import { httpClient } from '../httpClient';
import { Scholarship, Stage, ScholarshipStatus, StageStatus } from '../../features/types/schema';

const ENDPOINTS = {
  BASE: '/scholarships',
  DETAIL: (id: string) => `/scholarships/${id}`,
  BY_STUDENT: (studentId: string) => `/scholarships/student/${studentId}`,
  STAGES: (scholarshipId: string) => `/scholarships/${scholarshipId}/stages`,
  STAGE_DETAIL: (scholarshipId: string, stageId: string) => 
    `/scholarships/${scholarshipId}/stages/${stageId}`,
  UPDATE_STATUS: (id: string, status: ScholarshipStatus) => 
    `/scholarships/${id}/status/${status}`,
};

/**
 * Scholarship API Service
 * Handles all scholarship-related API interactions
 */
class ScholarshipService {
  /**
   * Get all scholarships
   */
  async getAllScholarships(): Promise<Scholarship[]> {
    return httpClient.get<Scholarship[]>(ENDPOINTS.BASE);
  }

  /**
   * Get scholarship by ID
   */
  async getScholarshipById(id: string): Promise<Scholarship> {
    return httpClient.get<Scholarship>(ENDPOINTS.DETAIL(id));
  }

  /**
   * Get scholarships by student
   */
  async getScholarshipsByStudent(studentId: string): Promise<Scholarship[]> {
    return httpClient.get<Scholarship[]>(ENDPOINTS.BY_STUDENT(studentId));
  }

  /**
   * Create a new scholarship
   */
  async createScholarship(scholarship: Omit<Scholarship, 'id'>): Promise<Scholarship> {
    return httpClient.post<Scholarship>(ENDPOINTS.BASE, scholarship);
  }

  /**
   * Update scholarship information
   */
  async updateScholarship(id: string, scholarship: Partial<Scholarship>): Promise<Scholarship> {
    return httpClient.put<Scholarship>(ENDPOINTS.DETAIL(id), scholarship);
  }

  /**
   * Update scholarship status
   */
  async updateScholarshipStatus(id: string, status: ScholarshipStatus): Promise<Scholarship> {
    return httpClient.put<Scholarship>(ENDPOINTS.UPDATE_STATUS(id, status), {});
  }

  /**
   * Delete scholarship
   */
  async deleteScholarship(id: string): Promise<void> {
    return httpClient.delete<void>(ENDPOINTS.DETAIL(id));
  }

  /**
   * Get scholarship stages
   */
  async getScholarshipStages(scholarshipId: string): Promise<Stage[]> {
    return httpClient.get<Stage[]>(ENDPOINTS.STAGES(scholarshipId));
  }

  /**
   * Create stage for scholarship
   */
  async createStage(scholarshipId: string, stage: Omit<Stage, 'id'>): Promise<Stage> {
    return httpClient.post<Stage>(ENDPOINTS.STAGES(scholarshipId), stage);
  }

  /**
   * Update stage status
   */
  async updateStageStatus(
    scholarshipId: string, 
    stageId: string, 
    status: StageStatus,
    comment?: string
  ): Promise<Stage> {
    return httpClient.put<Stage>(
      ENDPOINTS.STAGE_DETAIL(scholarshipId, stageId), 
      { status, comment, update_date: new Date().toISOString() }
    );
  }
}

export const scholarshipService = new ScholarshipService(); 