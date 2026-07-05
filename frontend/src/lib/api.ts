import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '@/config';

export class ApiError extends Error {
  status: number;
  title: string;
  detail?: string;
  errors?: Array<{ field: string; message: string }>;

  constructor(status: number, title: string, detail?: string, errors?: Array<{ field: string; message: string }>) {
    super(detail || title);
    this.name = 'ApiError';
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.errors = errors;
  }
}

// Create custom axios client
export const client = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to intercept errors and map them to ApiError
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const errorData = error.response.data || {};
      return Promise.reject(
        new ApiError(
          errorData.status || error.response.status,
          errorData.title || 'An error occurred',
          errorData.detail,
          errorData.errors
        )
      );
    }
    return Promise.reject(new ApiError(500, 'Network Error', error.message));
  }
);
