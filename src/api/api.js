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
export const getInscripciones = () => api.get('/inscripciones');
export const addInscripcion = (data) => api.post('/inscripciones', data);
export const updateInscripcion = (data) => api.put('/inscripciones', data);
export const deleteInscripcion = (id) => api.delete(`/inscripciones/${id}`);
export const inscripcionEstudiante = (data) => api.post(`/inscripcion/v1/register`, data);


//area
export const getAreas = () => api.get('/areas');
export const addArea = (data) => api.post('/areas/register-area', data);
export const updateArea = (id,data) => api.put(`/areas/${id}`, data);
export const deleteArea = (id) => api.delete(`/areas/${id}`);
export const getAreaByIdGrade = (id) => api.get(`/nivelescolar-categoria-area/areas-categorias/${id}`);

export const registerParticipante = (data) => api.post('/participantes/register-participant', data);
export const register = (data) => api.post('/register', data)
//Nivel escolar;
export const getNivelEscolar = () => api.get('/nivelescolar');

export const getDepartamentos = () => api.get('/departamento');
export const getDepartamentoById = (id) => api.get(`/departamento/${id}`);
export const getMunicipios = (id) => api.get(`/municipios/${id}`);
export const getMunicipiosByDepartamento = (id) => api.get(`/municipios/departamento/${id}`);
export const getColegiosByMunicipio = (id) => api.get(`/colegios/municipio/${id}`);
export const registerFechas = (data) => api.post('/fechas/register-fechas', data);

//TUTORES 
export const getAllTutor = () => api.get('/tipo-tutor/findAllTipoTutor');
export const registerTutor = (data) => api.post('/tutores/register-tutor', data);

//CATEGORIAS 
export const createCategory = (data) => api.post('/nivelescolar-categoria-area/register', data);