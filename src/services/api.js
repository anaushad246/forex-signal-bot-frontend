import axios from 'axios';

// This is the base URL of your Node.js backend
// (as defined in your backend project)
// const API_BASE_URL = 'http://localhost:5000/api/v1';
// 1. Read the base URL from the .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not set. Check your .env file.");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;