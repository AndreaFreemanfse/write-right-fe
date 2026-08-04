let PROD = import.meta.env.PROD;

export const API_BASE_URL = PROD
  ? import.meta.env.VITE_API_URL
  : "http://localhost:8000";
