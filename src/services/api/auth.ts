/**
 * AUTHENTICATION SERVICE MODULE
 * 
 * This file implements the API service for authentication-related operations.
 * It provides functionality for user login, registration, session management,
 * and token validation in the ERP system.
 * 
 * Key features:
 * - User authentication with username/password validation
 * - User registration (disabled in this mock version)
 * - Session management through localStorage
 * - Token validation for persistent login
 * - Credential validation against predefined user accounts
 * 
 * Authentication flow:
 * 1. User submits credentials via login form
 * 2. Service validates credentials against predefined accounts in loginCredentials.ts
 * 3. If valid, user data is stored in localStorage with a token
 * 4. AuthContext uses validateToken to restore session on page reload
 * 
 * Mock implementation:
 * This service simulates API calls for development and testing.
 * In production, these methods would make actual HTTP requests to a backend API.
 */

import { LoginCredentials, SignupData, User } from '../../features/types';
import { ApiError } from '../httpClient';
import { APP_CONFIG, AUTH_CONFIG } from '../../config';
import {
  DEAN_LOGIN,
  HOD_LOGINS,
  SUPERVISOR_LOGINS,
  STUDENT_LOGINS,
  findLoginDetailsByUsername
} from '../loginCredentials';

/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */
class AuthService {
  /**
   * Authenticate a user with credentials
   * Validates against predefined login details and creates user session
   * 
   * @param credentials User login credentials (username, password)
   * @returns Promise resolving to authenticated user information
   * @throws Error if credentials are invalid
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

      // Check if role matches the expected role 
      if (loginDetail.role !== credentials.role) {
        throw new Error(`This account has role '${loginDetail.role}' but you're trying to login as '${credentials.role}'`);
      }

      // Create a user object based on validated login details
      const user: User = {
        username: loginDetail.username,
        role: loginDetail.role,
        firstName: loginDetail.name.split(' ')[0], // First name
        lastName: loginDetail.name.split(' ').slice(1).join(' '), // Last name (everything after first name)
        email: loginDetail.email,
        department: loginDetail.department,
        designation: loginDetail.designation,
        course: loginDetail.course, // Only present for supervisors and students
        profileImageUrl: `${APP_CONFIG.DEFAULT_AVATAR_API}?seed=${loginDetail.username}`,
        lastLogin: new Date(),
      };

      // Store auth token and user data
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, 'mock-jwt-token');
      localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));

      console.log('Login successful:', user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof ApiError) {
        throw new Error(`Login failed: ${error.message}`);
      }
      if (error instanceof Error) {
        throw error; // Preserve the original error message
      }
      throw new Error('Login failed: Unable to authenticate');
    }
  }

  /**
   * Register a new user (disabled in mock implementation)
   * In this mock version, registration is disabled since we're using predefined accounts
   * 
   * @param signupData User registration data
   * @returns Promise resolving to newly created user information
   * @throws Error indicating registration is disabled
   */
  async signup(signupData: SignupData): Promise<User> {
    try {
      // In a real implementation, this would call the API
      // const user = await httpClient.post<User>('/auth/register', signupData, { withAuth: false });

      // For mock implementation, reject signup attempts since we're using predefined users
      throw new Error('Registration is disabled. Please use one of the predefined login accounts.');

    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      if (error instanceof Error) {
        throw error; // Preserve the original error message
      }
      throw new Error('Registration failed: Unable to create account');
    }
  }

  /**
   * Log out the current user
   * Removes the authentication token and user data from localStorage
   * 
   * @returns Promise resolving to void on success
   */
  async logout(): Promise<void> {
    try {
      // In a real implementation, this would call the API
      // await httpClient.post('/auth/logout', {});

      // Clear stored auth data
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);

      return Promise.resolve();
    } catch (e) {
      console.error('Logout error:', e);
      // Still remove local storage items even if API call fails
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
      throw e; // Propagate the error for better debugging
    }
  }

  /**
   * Validate the current authentication token
   * Retrieves and validates the stored user data
   * 
   * @returns Promise resolving to user information if token is valid
   * @throws Error if token is invalid or expired
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
   * Verifies if an authentication token exists in localStorage
   * 
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  /**
   * Get list of available users for the login page
   * Provides usernames, roles and names from predefined users
   * 
   * @returns Array of usernames and roles
   */
  getAvailableUsers(): { username: string, role: string, name: string }[] {
    return [
      { username: DEAN_LOGIN.username, role: DEAN_LOGIN.role, name: DEAN_LOGIN.name },
      ...HOD_LOGINS.map(hod => ({ username: hod.username, role: hod.role, name: hod.name })),
      ...SUPERVISOR_LOGINS.map(sup => ({ username: sup.username, role: sup.role, name: sup.name })),
      ...STUDENT_LOGINS.map(student => ({ username: student.username, role: student.role, name: student.name }))
    ];
  }
}

export const authService = new AuthService();
