import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5173",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
