const API_BASE = "http://localhost:8000/api";

export const apiService = async (url, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };
  if (config.body) {
    config.body = JSON.stringify(config.body);
  }
  const response = await fetch(`${API_BASE}${url}`, config);
  return await response.json();
};
