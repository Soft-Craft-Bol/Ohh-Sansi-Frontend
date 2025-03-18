import axios from 'axios';
import { getToken } from '../utils/authFunctions';

//deply
// const baseURL = "https://api.inpasep.com/api/v1";
const baseURL = "http://localhost:8080/api/v1";

const api = axios.create({
    baseURL: baseURL,
    responseType: 'json',
    withCredentials: true, 
    timeout: 60000,
  });

/* api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
}); */
//
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

export const loginUser = (data) => api.post('/auth/log-in', data);
export const addUser = (data) => api.post('/auth/sign-up', data);