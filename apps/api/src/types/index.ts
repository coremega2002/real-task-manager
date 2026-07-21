// Type definitions for your API

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Add your type definitions here
