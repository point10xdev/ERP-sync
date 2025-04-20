import { LoginCredentials, SignupData, User } from '../../features/types';
import { ApiError } from '../httpClient';
import { APP_CONFIG, AUTH_CONFIG } from '../../config';
import { DEAN_LOGIN, HOD_LOGINS, SUPERVISOR_LOGINS, findLoginDetailsByUsername } from '../loginCredentials';

/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */
class AuthService {
  /**
   * Authenticate a user with credentials
   * @param credentials User login credentials
   * @returns Authenticated user information
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // In a real implementation, this would call the API
      // const user = await httpClient.post<User>('/auth/login', credentials, { withAuth: false });

      // Validate credentials against our predefined login details
      const loginDetail = findLoginDetailsByUsername(credentials.username);

      if (!loginDetail) {
        throw new Error('Invalid username. User not found.');
      }

      if (loginDetail.password !== credentials.password) {
        throw new Error('Invalid password');
      }

      // Create a user object based on validated login details
      const user: User = {
        username: loginDetail.username,
        role: loginDetail.role,
        firstName: loginDetail.name.split(' ')[1], // Assuming "Dr. First Last" format
        lastName: loginDetail.name.split(' ')[2] || '', // Some names might not have Last name
        email: loginDetail.email,
        department: loginDetail.department,
        designation: loginDetail.designation,
        course: loginDetail.course, // Only present for supervisors
        profileImageUrl: `${APP_CONFIG.DEFAULT_AVATAR_API}?seed=${loginDetail.username}`,
        lastLogin: new Date(),
      };

      // Store auth token and user data
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, 'mock-jwt-token');
      localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));

      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Login failed: ${error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error('Login failed: Unable to authenticate');
    }
  }

  /**
   * Register a new user
   * @param data User registration data
   * @returns Newly created user information
   */
  async signup(data: SignupData): Promise<User> {
    try {
      // In a real implementation, this would call the API
      // const user = await httpClient.post<User>('/auth/register', data, { withAuth: false });

      // For mock implementation, reject signup attempts since we're using predefined users
      throw new Error('Registration is disabled. Please use one of the predefined login accounts.');

    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error('Registration failed: Unable to create account');
    }
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      // In a real implementation, this would call the API
      // await httpClient.post('/auth/logout', {});

      // Clear stored auth data
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);

      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove local storage items even if API call fails
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    }
  }

  /**
   * Validate the current authentication token
   * @returns User information if token is valid
   */
  async validateToken(): Promise<User> {
    try {
      // In a real implementation, this would call the API
      // return await httpClient.get<User>('/auth/validate');

      // Mock implementation
      const storedUser = localStorage.getItem(AUTH_CONFIG.USER_KEY);
      if (!storedUser) {
        throw new Error('No stored user found');
      }
      return JSON.parse(storedUser);
    } catch (error) {
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
      throw new Error('Invalid or expired session');
    }
  }

  /**
   * Check if user is currently authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  /**
   * Get list of available users for the login page
   * @returns Array of usernames and roles
   */
  getAvailableUsers(): { username: string, role: string, name: string }[] {
    return [
      { username: DEAN_LOGIN.username, role: DEAN_LOGIN.role, name: DEAN_LOGIN.name },
      ...HOD_LOGINS.map(hod => ({ username: hod.username, role: hod.role, name: hod.name })),
      ...SUPERVISOR_LOGINS.map(sup => ({ username: sup.username, role: sup.role, name: sup.name }))
    ];
  }
}

export const authService = new AuthService();
