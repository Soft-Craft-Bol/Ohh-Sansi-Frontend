import axios from 'axios';

//const baseURL = "https://ohh-sansi.onrender.com/api/v1";
const baseURL = "http://localhost:9999/api/v1";

const api = axios.create({
    baseURL: baseURL,
    responseType: 'json',
    withCredentials: true, 
    timeout: 100000,
  });
  //comgit 


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
export const registerParticipante = (data) => api.post('/participantes/register-participant', data);
export const register = (data) => api.post('/register', data)
//DEPARTAMENTOS Y MUNICIPIOS
export const getDepartamentos = () => api.get('/departamento');
export const getDepartamentoById = (id) => api.get(`/departamento/${id}`);
export const getMunicipios = (id) => api.get(`/municipios/${id}`);
export const getMunicipiosByDepartamento = (id) => api.get(`/municipios/departamento/${id}`);
export const getColegiosByMunicipio = (id) => api.get(`/colegios/municipio/${id}`);
//area
export const getAreas = () => api.get('/areas');
export const addArea = (data) => api.post('/areas/register-area', data);
export const updateArea = (id,data) => api.put(`/areas/${id}`, data);
export const deleteArea = (id) => api.delete(`/areas/${id}`);

export const getEstudianteByCarnet = (carnet) => api.get(`/participante/carnet/${carnet}`);
export const asignarAreasEstudiantes = (carnet, data) => api.post(`/participante/register-participant-catalogo/${carnet}`, data);
//AREA NIVEL ESCOLAR CATEGORIA
export const getAreaByIdGrade = (id) => api.get(`/nivelescolar-categoria-area/areas-categorias/${id}`);
export const getAreasGrados = () => api.get('/nivelescolar-categoria-area/areas-grados');
export const getAreasCategorias = () => api.get('/nivelescolar-categoria-area/areas-categorias');
//Nivel escolar;
export const getNivelEscolar = () => api.get('/nivelescolar');
//CATEGORIAS 
export const createCategory = (data) => api.post('/nivelescolar-categoria-area/register', data);
export const getCategories = () => api.get('/category');


//TUTORES 
export const getAllTutor = () => api.get('/tipo-tutor/findAllTipoTutor');
export const registerTutor = (data) => api.post('/tutores/register-tutor', data);
export const createTutor = (data) => api.post('/tutor', data);



//PERIODO DE INSCRIPCION
export const upsertFechas = (data) => api.post('/plazo-inscripcion/register', data);
export const getFechas = () => api.get('/plazo-inscripcion');
export const deleteFechas = (id) => api.delete(`/plazo-inscripcion/${id}`);
export const getFechasById = (id) => api.get(`/plazo-inscripcion/${id}`);
export const getLastActiveFechas = () => api.get('/plazo-inscripcion/activo');
export const insertPrecio = (data) => api.post('/precio/register-precio', data);

//EMAILS
export const sendEmail = (data) => api.post('/email/send', data);

//OrdenPAGO
export const getOrdenPagoDetailInfo = (codigoUnico) => api.get(`/inscripcion/details/${codigoUnico}`);
export const createOrdenPago = (data) => api.post('/orden-pago', data);
