import ky, { Options, KyInstance } from "ky";
import { toast } from "react-hot-toast";

// You can set your API base URL here
const apiBaseUrl = "https://high-tribe-backend.hiconsolutions.com/api/";

const api = ky.create({
  prefixUrl: apiBaseUrl,
  hooks: {
    beforeRequest: [
      (request) => {
        // Optionally add auth token from localStorage if available
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
          }
        }
        
        // Set Content-Type to application/json only if not sending FormData
        if (!(request.body instanceof FormData)) {
          request.headers.set("Content-Type", "application/json");
        }
        if (request.body instanceof FormData) {
          request.headers.set("Content-Type", "multipart/form-data");
        }
      },
    ],
  },
});

// Helper for typed requests
export async function apiRequest<T>(
  input: string,
  options?: Options,
  successMessage?: string
): Promise<T> {
  try {
    const result = await api(input, options).json<T>();
    
    // Check if the response contains an error message even with 200 status
    // Only treat as error if it has 'error' field AND doesn't have 'user' or 'token' fields (success indicators)
    if (result && typeof result === 'object' && 'error' in result && !('user' in result) && !('token' in result)) {
      const errorMessage = (result as any).message || (result as any).error || "An error occurred";
      const error = new Error(errorMessage) as Error & { status?: number };
      error.name = "ApiError";
      error.status = 400; // Treat as client error
      
      toast.error(errorMessage);
      throw error;
    }
    
    // Only show success message if no error was found
    if (successMessage) {
      toast.success(successMessage);
    }
    return result;
  } catch (err: any) {
    let message = "An unexpected error occurred. Please try again.";
    let shouldShowToast = true;
    
    if (err?.response) {
      const status = err.response.status;
      try {
        const data = await err.response.json();
        
        // Handle specific error messages from API
        if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        } else {
          // Provide meaningful messages based on HTTP status codes
          switch (status) {
            case 400:
              message = "Invalid request. Please check your input and try again.";
              break;
            case 401:
              message = "Authentication failed. Please check your credentials.";
              break;
            case 403:
              message = "Access denied. You don't have permission to perform this action.";
              break;
            case 404:
              message = "Resource not found. Please check the URL and try again.";
              break;
            case 409:
              message = "Conflict detected. This resource already exists.";
              break;
            case 422:
              message = "Validation failed. Please check your input data.";
              break;
            case 429:
              message = "Too many requests. Please wait a moment and try again.";
              break;
            case 500:
              message = "Server error. Please try again later.";
              break;
            case 502:
            case 503:
            case 504:
              message = "Service temporarily unavailable. Please try again later.";
              break;
            default:
              message = `Request failed (${status}). Please try again.`;
          }
        }
      } catch {
        // If we can't parse the error response, use status-based message
        switch (status) {
          case 401:
            message = "Authentication failed. Please check your credentials.";
            break;
          case 403:
            message = "Access denied. You don't have permission to perform this action.";
            break;
          case 404:
            message = "Resource not found. Please check the URL and try again.";
            break;
          case 500:
            message = "Server error. Please try again later.";
            break;
          default:
            message = `Request failed (${status}). Please try again.`;
        }
      }
    } else if (err?.message) {
      // Handle network errors
      if (err.message.includes("fetch")) {
        message = "Network error. Please check your internet connection and try again.";
      } else if (err.message.includes("timeout")) {
        message = "Request timed out. Please try again.";
      } else {
        message = err.message;
      }
    }
    
    // Create a new error with the proper message
    const error = new Error(message) as Error & { status?: number };
    error.name = "ApiError";
    error.status = err?.response?.status;
    
    // Only show toast if shouldShowToast is true
    if (shouldShowToast) {
      toast.error(message);
    }
    
    throw error;
  }
}

// Helper function to get user-friendly error messages
export function getErrorMessage(error: any, context?: string): string {
  if (error?.message) {
    const message = error.message.toLowerCase();
    
    // Common error patterns
    if (message.includes("username")) {
      return "Username is already taken. Please choose a different username.";
    }
    if (message.includes("email")) {
      return "Email is already registered. Please use a different email or try logging in.";
    }
    if (message.includes("phone")) {
      return "Phone number is already registered. Please use a different phone number.";
    }
    if (message.includes("password")) {
      return "Password requirements not met. Please ensure your password is at least 8 characters long.";
    }
    if (message.includes("validation")) {
      return "Please check your input and ensure all fields are filled correctly.";
    }
    if (message.includes("network")) {
      return "Network error. Please check your internet connection and try again.";
    }
    if (message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }
    if (message.includes("server")) {
      return "Server error. Please try again later.";
    }
    if (message.includes("authentication") || message.includes("credentials") || message.includes("invalid credentials")) {
      return "Invalid email or password. Please check your credentials and try again.";
    }
  }
  
  return error?.message || "An unexpected error occurred. Please try again.";
}

// Utility function to set token cookie
export function setTokenCookie(token: string) {
  const maxAge = 60 * 60 * 24 * 7; // 1 week
  const secure = process.env.NODE_ENV === 'production';
  const cookieValue = `token=${token}; path=/; max-age=${maxAge}; SameSite=Strict${secure ? '; Secure' : ''}`;
  document.cookie = cookieValue;
}

// Utility function to remove token cookie
export function removeTokenCookie() {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export default api;
