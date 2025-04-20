export type Role = 'dean' | 'supervisor' | 'hod' | 'student';

export interface User {
  username: string;
  role: Role;
  profileImageUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  designation?: string;
  course?: string;
  lastLogin?: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
  role: Role;
}

export interface SignupData extends LoginCredentials {
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
