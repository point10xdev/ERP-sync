import { LoginCredentials, SignupData, User } from '../../features/types';
import { ApiError } from '../httpClient';
import { APP_CONFIG, AUTH_CONFIG } from '../../config';

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
      
      // Mock implementation
      const user: User = {
        username: credentials.username,
        role: credentials.role,
        profileImageUrl: `${APP_CONFIG.DEFAULT_AVATAR_API}?seed=${credentials.username}`,
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
      
      // Mock implementation
      const user: User = {
        username: data.username,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        department: data.department,
        profileImageUrl: `${APP_CONFIG.DEFAULT_AVATAR_API}?seed=${data.username}`,
        lastLogin: new Date(),
      };
      
      // Store auth token and user data
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, 'mock-jwt-token');
      localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      if (error instanceof ApiError) {
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
}

export const authService = new AuthService();
