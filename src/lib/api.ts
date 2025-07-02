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
    if (successMessage) {
      toast.success(successMessage);
    }
    return result;
  } catch (err: any) {
    let message = "An unexpected error occurred.";
    if (err?.response) {
      try {
        const data = await err.response.json();
        message = data?.message || data?.error || message;
      } catch {}
    } else if (err?.message) {
      message = err.message;
    }
    toast.error(message);
    throw err;
  }
}

export default api;
