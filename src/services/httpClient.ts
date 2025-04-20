/**
 * HTTP Client Service
 * Centralized API client with interceptors, error handling, and type safety
 */
import { API_CONFIG, AUTH_CONFIG } from '../config';

// Error types for better error handling
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Request options interface
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  withAuth?: boolean;
}

// Response interface
interface ApiResponse<T> {
  data: T;
  status: number;
}

/**
 * HTTP Client for making API requests
 * Provides methods for common HTTP verbs with proper error handling
 */
class HttpClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}`;
  }

  /**
   * Add authorization header if token exists
   */
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Create query string from params object
   */
  private createQueryString(params?: Record<string, string>): string {
    if (!params) return '';
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    return searchParams.toString() ? `?${searchParams.toString()}` : '';
  }

  /**
   * Process API response
   */
  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: 'Unknown error occurred' };
      }
      throw new ApiError(
        errorData.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return { data, status: response.status };
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { headers = {}, params, withAuth = true } = options;
    const url = `${this.baseUrl}${endpoint}${this.createQueryString(params)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(withAuth ? this.getAuthHeader() : {}),
      },
    });

    const result = await this.processResponse<T>(response);
    return result.data;
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const { headers = {}, withAuth = true } = options;
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(withAuth ? this.getAuthHeader() : {}),
      },
      body: JSON.stringify(data),
    });

    const result = await this.processResponse<T>(response);
    return result.data;
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const { headers = {}, withAuth = true } = options;
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(withAuth ? this.getAuthHeader() : {}),
      },
      body: JSON.stringify(data),
    });

    const result = await this.processResponse<T>(response);
    return result.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { headers = {}, withAuth = true } = options;
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(withAuth ? this.getAuthHeader() : {}),
      },
    });

    const result = await this.processResponse<T>(response);
    return result.data;
  }
}

export const httpClient = new HttpClient();
