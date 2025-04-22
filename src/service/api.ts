import axios from "axios";

const api = axios.create({
  // baseURL: "http://127.0.0.1:8080",
  baseURL: "http://localhost:8080",
  timeout: 80000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export default api;
