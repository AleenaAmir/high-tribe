import ky, { Options, KyInstance } from "ky";

// You can set your API base URL here
const apiBaseUrl =
  typeof window === "undefined" ? process.env.NEXT_PUBLIC_API_URL || "" : "";

const api = ky.create({
  prefixUrl: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
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
      },
    ],
  },
});

// Helper for typed requests
export async function apiRequest<T>(
  input: string,
  options?: Options
): Promise<T> {
  return api(input, options).json<T>();
}

export default api;
