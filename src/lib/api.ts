import ky, { Options, KyInstance } from "ky";
import { toast } from "react-hot-toast";

// You can set your API base URL here
const apiBaseUrl = "https://api.hightribe.com/api/";

const api = ky.create({
  prefixUrl: apiBaseUrl,
  hooks: {
    beforeRequest: [
      (request) => {
        // Optionally add auth token from localStorage if available
        if (typeof window !== "undefined") {
          let token = localStorage.getItem("token");
          // TEMP: Hardcoded token for testing. REMOVE after testing!
          if (!token) {
            token = "<PASTE_VALID_TOKEN_HERE>";
          }
          if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
          }
        }

        // Set Content-Type to application/json only if not sending FormData
        if (!(request.body instanceof FormData)) {
          request.headers.set("Content-Type", "application/json");
        }
        // Don't set Content-Type for FormData - let the browser set it with boundary
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

/**
 * Helper for FormData requests with better error handling and logging
 * 
 * @example
 * ```typescript
 * const formData = new FormData();
 * formData.append("file", file);
 * formData.append("title", "My Title");
 * 
 * const result = await apiFormDataRequest<ApiResponse>(
 *   "upload/endpoint",
 *   formData,
 *   { method: "POST" },
 *   "File uploaded successfully!"
 * );
 * ```
 */
export async function apiFormDataRequest<T>(
  input: string,
  formData: FormData,
  options?: Omit<RequestInit, 'body'>,
  successMessage?: string
): Promise<T> {
  try {
    // Get token from localStorage
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
      // TEMP: Hardcoded token for testing. REMOVE after testing!
      if (!token) {
        token = "<PASTE_VALID_TOKEN_HERE>";
      }
    }

    // Prepare headers
    const headers: HeadersInit = {
      Accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Make the request
    const response = await fetch(`${apiBaseUrl}${input}`, {
      method: options?.method || "POST",
      headers,
      body: formData,
      ...options,
    });

    // Parse response
    let data: T;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error("Failed to parse response");
    }

    // Check if the response contains an error message even with 200 status
    if (data && typeof data === 'object' && 'error' in data && !('user' in data) && !('token' in data)) {
      const errorMessage = (data as any).message || (data as any).error || "An error occurred";
      const error = new Error(errorMessage) as Error & { status?: number };
      error.name = "ApiError";
      error.status = 400; // Treat as client error

      toast.error(errorMessage);
      throw error;
    }

    // Handle HTTP error status codes
    if (!response.ok) {
      let message = "An error occurred during the request.";
      
      if (data && typeof data === 'object' && 'message' in data) {
        message = (data as any).message;
      } else if (data && typeof data === 'object' && 'error' in data) {
        message = (data as any).error;
      } else {
        // Provide meaningful messages based on HTTP status codes
        switch (response.status) {
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
            message = `Request failed (${response.status}). Please try again.`;
        }
      }

      const error = new Error(message) as Error & { status?: number };
      error.name = "ApiError";
      error.status = response.status;
      toast.error(message);
      throw error;
    }

    // Only show success message if no error was found
    if (successMessage) {
      toast.success(successMessage);
    }
    return data;
  } catch (err: any) {
    // If it's already an ApiError, re-throw it
    if (err.name === "ApiError") {
      throw err;
    }

    let message = "An unexpected error occurred. Please try again.";

    if (err?.message) {
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

    toast.error(message);
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

/**
 * Enhanced FormData request wrapper with debugging and better error handling
 * 
 * @example
 * ```typescript
 * const formData = new FormData();
 * formData.append("title", "My Title");
 * formData.append("description", "My Description");
 * 
 * const result = await apiFormDataWrapper<ApiResponse>(
 *   "posts",
 *   formData,
 *   "Post created successfully!"
 * );
 * ```
 */
export async function apiFormDataWrapper<T>(
  endpoint: string,
  formData: FormData,
  successMessage?: string,
  options?: Omit<RequestInit, 'body'>
): Promise<T> {
  try {
    // Get token from localStorage
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
      // TEMP: Hardcoded token for testing. REMOVE after testing!
      if (!token) {
        token = "<PASTE_VALID_TOKEN_HERE>";
      }
    }

    // Debug: Log FormData contents in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Making FormData request to: ${endpoint}`);
      console.log("📦 FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
    }

    // Prepare headers
    const headers: HeadersInit = {
      Accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Make the request
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: options?.method || "POST",
      headers,
      body: formData,
      ...options,
    });

    // Parse response
    let data: T;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("❌ Failed to parse response:", parseError);
      throw new Error("Failed to parse server response");
    }

    // Debug: Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Response from ${endpoint}:`, data);
    }

    // Check if the response contains an error message even with 200 status
    if (data && typeof data === 'object' && 'error' in data && !('user' in data) && !('token' in data)) {
      const errorMessage = (data as any).message || (data as any).error || "An error occurred";
      const error = new Error(errorMessage) as Error & { status?: number };
      error.name = "ApiError";
      error.status = 400; // Treat as client error

      console.error("❌ API Error:", errorMessage);
      toast.error(errorMessage);
      throw error;
    }

    // Handle HTTP error status codes
    if (!response.ok) {
      let message = "An error occurred during the request.";
      
      if (data && typeof data === 'object' && 'message' in data) {
        message = (data as any).message;
      } else if (data && typeof data === 'object' && 'error' in data) {
        message = (data as any).error;
      } else {
        // Provide meaningful messages based on HTTP status codes
        switch (response.status) {
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
            message = `Request failed (${response.status}). Please try again.`;
        }
      }

      console.error(`❌ HTTP ${response.status} Error:`, message);
      console.error("Response data:", data);

      const error = new Error(message) as Error & { status?: number };
      error.name = "ApiError";
      error.status = response.status;
      toast.error(message);
      throw error;
    }

    // Only show success message if no error was found
    if (successMessage) {
      toast.success(successMessage);
    }

    return data;
  } catch (err: any) {
    // If it's already an ApiError, re-throw it
    if (err.name === "ApiError") {
      throw err;
    }

    let message = "An unexpected error occurred. Please try again.";

    if (err?.message) {
      // Handle network errors
      if (err.message.includes("fetch")) {
        message = "Network error. Please check your internet connection and try again.";
      } else if (err.message.includes("timeout")) {
        message = "Request timed out. Please try again.";
      } else {
        message = err.message;
      }
    }

    console.error("❌ Unexpected error:", err);

    // Create a new error with the proper message
    const error = new Error(message) as Error & { status?: number };
    error.name = "ApiError";

    toast.error(message);
    throw error;
  }
}

export default api;
