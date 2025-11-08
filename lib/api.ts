import axios from "axios";

const API_BASE_URL =  "https://616742b68abb.ngrok-free.app/app";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
