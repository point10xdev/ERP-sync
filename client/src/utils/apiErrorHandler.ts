import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.error || 'An error occurred';
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      toast.error('Session expired. Please login again.');
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
      return;
    }

    if (error.response?.status === 404) {
      toast.error('Resource not found');
      return;
    }

    if (error.response?.status === 422) {
      // Handle validation errors
      const details = error.response.data.details;
      if (Array.isArray(details)) {
        details.forEach((detail: any) => {
          toast.error(detail.msg || 'Validation error');
        });
      }
      return;
    }

    // Default error handling
    toast.error(message);
  } else {
    // Handle non-Axios errors
    console.error('Unexpected error:', error);
    toast.error('An unexpected error occurred');
  }
}; 