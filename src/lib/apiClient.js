export async function authFetch(path, options = {}) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  
    return fetch(`${API_URL}${path}`, { ...options, headers });
  }