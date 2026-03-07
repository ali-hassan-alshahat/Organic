const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const apiService = async (endpoint, options = {}) => {
  const { method = "GET", body, headers = {}, ...rest } = options;
  const token = localStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: defaultHeaders,
    ...rest,
  };

  // Add body for non-GET requests
  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  try {
    // Construct the full URL
    const url = API_BASE_URL
      ? `${API_BASE_URL}/api${endpoint}`
      : `/api${endpoint}`;

    console.log("Fetching:", url); // for debugging

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("API Service Error:", error);
    throw error;
  }
};
