// Schema types based on the database model

export type SystemRole = 'dean' | 'hod' | 'student' | 'supervisor';

export interface UserAuth {
  id: string;
  username: string;
  // Password is not included in frontend types for security reasons
}

export interface RoleEntity {
  id: string;
  role: SystemRole;
}

export interface Faculty {
  id: string;
  user: string; // Reference to UserAuth.id
  name: string;
  email: string;
  phone_number: string;
  department: string;
  designation: string;
  role: SystemRole;
  profile_pic?: string;
}

export interface Student {
  id: string;
  enroll: string;
  registration: string;
  user: string; // Reference to UserAuth.id
  name: string;
  email: string;
  phone_number: string;
  address: string;
  department: string;
  course: string;
  university: string;
  joining_date: string;
  supervisor?: string; // Reference to Faculty.id
  scholarship_basic?: number;
  scholarship_hra?: number;
  profile_pic?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  scholar: string; // Reference to Student.id
  month: string;
  year: string;
  days: number;
  total_pay: number;
  total_pay_per_day: number;
  basic: number;
  hra: number;
  status: ScholarshipStatus;
}

export type ScholarshipStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface Stage {
  id: string;
  scholarship: string; // Reference to Scholarship.id
  role: SystemRole; // Who is responsible at this stage
  status: StageStatus;
  comment?: string;
  update_date: string;
}

export type StageStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'completed'; 