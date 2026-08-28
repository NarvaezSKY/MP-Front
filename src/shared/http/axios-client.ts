import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'https://naricai.ts.net';

export const httpClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const API_BASE = API_URL;
