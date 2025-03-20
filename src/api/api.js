import axios from 'axios';

const baseURL = "http://localhost:9999/api/v1";

const api = axios.create({
    baseURL: baseURL,
    responseType: 'json',
    withCredentials: true, 
    timeout: 60000,
  });
  


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

export const loginUser = (data) => api.post('/auth/login', data);
export const getUser = () => api.get('/auth/user')
export const addUser = (data) => api.post('/auth/register', data);
export const updateUser = (data) => api.put('/auth/user', data);
export const deletYser = (id) => api.delete(`/auth/user/${id}`);