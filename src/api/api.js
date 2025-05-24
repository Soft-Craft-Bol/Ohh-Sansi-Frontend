import axios from 'axios';
import { CodeSquare } from 'lucide-react';

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
//participantes
export const getInscripciones = () => api.get('/inscripciones');
export const addInscripcion = (data) => api.post('/inscripciones', data);
export const updateInscripcion = (data) => api.put('/inscripciones', data);
export const deleteInscripcion = (id) => api.delete(`/inscripciones/${id}`);
export const getInscripcionByID = (id) => api.get(`/inscripcion/${id}`);
export const inscripcionEstudiante = (data) => api.post(`/inscripcion/v1/register`, data);
export const registerParticipante = (data) => api.post('/participante/register-participant', data);
export const register = (data) => api.post('/register', data)
export const getParticipantesWithAreas = (ci) => api.get(`/participante/carnet/${ci}/areas-tutores`);
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

//GRADOS;
export const getGrados = () => api.get('/grados');
export const getGradosCategorias = () => api.get('/grado-categoria');

export const getEstudianteByCarnet = (carnet) => api.get(`/participante/carnet/${carnet}`);
export const getEstudenteByCi = (ci) => api.get(`/participante/carnet/${ci}/datos`);
export const verifyEstudiante = (data) => api.post('participante/verify', data);
export const getAreaByIdGrade = (id) => api.get(`/nivelescolar-categoria-area/areas-categorias/${id}`);
//CATEGORIAS 
export const createCategory = (data) => api.post('/grado-categoria/register', data);
export const getCategories = () => api.get('/category');

//TUTORES 
export const getAllTipoTutor = () => api.get('/tipo-tutor/findAllTipoTutor');
export const registerTutor = (ciParticipante, data) => 
  api.post(`/tutor/${ciParticipante}`, data);
export const registerTutorAcademico = (ciParticipante, idArea, data) =>api.post(`/tutor/academico/${ciParticipante}/${idArea}`, data);
export const getTutorAsigando = (data) => api.get(`/tutores/getTutoresLegales/${data}`);
export const getTutorByCi = (data) => api.get(`/tutor/byCi/${data}`);
export const verifyTutor = (data) => api.post('/tutor/verify', data);
export const parentescoTutor = () => api.get('/parentesco/findAllParentescos');

//OLIMPIADA
export const getOlimpiadas = () => api.get('/olimpiada');
export const saveOlimpiada = (data) => api.post('/olimpiada/register', data);
export const updateOlimpiada = (data) => api.put('/olimpiada/update-olimpiada', data);
export const getOlimpiadaPreinscripcion = () => api.get(`/fecha-olimpiada/periodo-inscripcion-actual`);

//CatalogoOlimpiada
export const saveCatalogoOlimpiada = (data) => api.post('/catalogo-olimpiada/save', data);
export const getCatalogoOlimpiada = () => api.get('/catalogo-olimpiada');

//FechaOlimpiada
export const getOlimpiadasConEventos = () => api.get('/fecha-olimpiada/olimpiadas-con-eventos');
export const savePeriodoOlimpiada = (data) => api.post('/fecha-olimpiada/register', data);
//EMAILS
export const sendEmail = (data) => api.post('/email/send', data);

//OrdenPAGO
export const getOrdenPagoDetailInfo = (codigoUnico) => api.get(`/inscripcion/details/${codigoUnico}`);
export const createOrdenPago = (data) => api.post('/orden-pago', data);

//estado orden de pago
export const getEstadoOrdenPago = () => api.get(`/api/estadisticas/ordenes-pago`);
export const getReporteOrdenPago = (fechaInicio, fechaFin) => 
  api.get(`/orden-pago/no-vencidas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
//estado de inscripcoin
export const getEstadoInscripcion = (ciParticipante) => api.get(`/estado-inscripcion/${ciParticipante}`);


//catalogo
export const getCatalogoAreasCategorias = (ciParticipante) => api.get(`/catalogo/ci-participante/${ciParticipante}`);
export const setCatalogoAreasParticipante = (ciParticipante, data) => 
  api.post(`/participante/register-participant-catalogo/${ciParticipante}`, data);

//reporte de inscritos
export const getReporteInscritos = (idArea) => api.get(`/inscripcion/reporte-por-area/${idArea}`);


//areaTutor participante

export const getTutorAreaParticipanteInfo = (ciParticipante) => api.get(`/tutor-area-participante/${ciParticipante}`);
export const setTutorAreaParticipante = (data) => api.post('/tutor-area-participante/save', data);
export const postOnlyExcelFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/inscripcion/masiva", formData);
};

//OCR43
export const sendImageForOCR = (data) => api.post('/ocr', data);
export const verificarPago = (data) => api.post('/comprobante-pago', data);