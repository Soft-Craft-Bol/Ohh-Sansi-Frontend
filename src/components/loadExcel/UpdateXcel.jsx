import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { FaUpload, FaDownload, FaCheck, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { ButtonPrimary } from '../button/ButtonPrimary';
import './LoadExcel.css';
import Swal from 'sweetalert2';
import plantilla from '../../assets/Plantilla-De-Inscipción-v1.xlsx';
import Table from '../table/Table';
import { excelRowSchemaAreas, excelRowSchemaDatos } from '../../schemas/ExcelValidation';
import { getInscripcionByID, postOnlyExcelFile, registerTutor, verificarParticipante } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { verificarTutor } from '../../hooks/loaderInfo/LoaderInfo';

const validExtensions = ['.xlsx'];
const columnasPermitidas = ['Nombres', 'Apellido Paterno', 'Apellido Materno', 'Departamento', 'Colegio', 'Carnet Identidad'];
const columnas = columnasPermitidas.map((col) => ({
  header: col,
  accessor: col
}));

const UpdateExcel = () => {
  const fileInputRef = useRef(null);
  const [excelData, setExcelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [buttonState, setButtonState] = useState('upload');
  const navigate = useNavigate();

  // Función para convertir fechas de Excel
  const convertirFechaExcel = (value) => {
    if (!value) return null;
    
    if (typeof value === 'number') {
      const utc_days = Math.floor(value - 25569);
      const utc_value = utc_days * 86400;
      return new Date(utc_value * 1000);
    }
    
    if (typeof value === 'string') {
      const parsedDate = new Date(value);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }
    
    if (value instanceof Date) {
      return value;
    }
    
    return null;
  };

  // Función para validar la edad (4-20 años)
  const validarEdad = (fechaNacimiento) => {
    const fechaNac = convertirFechaExcel(fechaNacimiento);
    if (!fechaNac) return false;
    
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad >= 4 && edad <= 20;
  };

  // Función para verificar si un participante ya está registrado
  const verificarParticipanteRegistrado = async (ci) => {
    try {
      const response = await verificarParticipante(ci);
      return response.data?.fechaNacimiento ? true : false;
    } catch (error) {
      console.error('Error al verificar participante:', error);
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required('Debe seleccionar un archivo'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setButtonState('loading');
      const file = values.file;
      const reader = new FileReader();
    
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      
        const hoja1 = workbook.Sheets['Datos'];
        const jsonHoja1 = XLSX.utils.sheet_to_json(hoja1, { raw: false, dateNF: 'yyyy-mm-dd' });
      
        const columnasHoja1 = ['Nombres', 'Apellido Paterno', 'Apellido Materno', 'Departamento', 'Colegio', 'Carnet Identidad'];
        const participantes = jsonHoja1.map((row) => {
          const nuevo = {};
          columnasHoja1.forEach((col) => {
            nuevo[col] = row[col] ?? '';
          });
          return nuevo;
        });
      
        if (participantes.length > 600) {
          Swal.fire({
            icon: "error",
            title: "El archivo contiene más de 600 registros",
            text: "Por favor, reduzca la cantidad o seleccione otro archivo",
            showConfirmButton: false,
            timer: 2500,
          });
          setSubmitting(false);
          setButtonState('error');
          return;
        }
      
        setExcelData(participantes);        
        setSubmitting(false);
        setButtonState('done');
      };
      reader.readAsArrayBuffer(file);
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    setExcelData([]);
    setButtonState('upload');
    setSelectedFile(file);
    
    if (!file) return;
    
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      formik.setFieldError('file', 'El archivo excede el tamaño máximo permitido (3 MB)');
      formik.setFieldValue('file', null);
      formik.setFieldTouched('file', true);
      Swal.fire({
        icon: "error",
        title: "Archivo demasiado grande",
        text: "El tamaño máximo permitido es de 3 MB.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    
    const extension = file.name.slice(file.name.lastIndexOf('.'));
    if (!validExtensions.includes(extension)) {
      formik.setFieldError('file', 'Formato de archivo no válido');
      formik.setFieldValue('file', null);
      formik.setFieldTouched('file', true);
      Swal.fire({
        icon: "error",
        title: "Formato de archivo incorrecto",
        text: "formatos permitidos: .xlsx, .xls",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    formik.setFieldValue('file', file);
    formik.setFieldError('file', null);
    formik.setFieldTouched('file', false);
  };

  const validarFilasDatos = async (filas) => {
    const errores = [];
    for (let i = 0; i < filas.length; i++) {
      try {
        if (filas[i].id_grado === 0 || filas[i].id_grado === '0') continue;
        
        // Validación de fecha de nacimiento
        if (!validarEdad(filas[i].FechaNacimiento)) {
          errores.push({
            hoja: filas[i]._hoja || 'Datos',
            fila: i + 2,
            columna: 'FechaNacimiento',
            mensaje: 'El participante debe tener entre 4 y 20 años'
          });
          continue;
        }

        // Verificar si el participante ya está registrado
        if (filas[i]['Carnet Identidad']) {
          const yaRegistrado = await verificarParticipanteRegistrado(filas[i]['Carnet Identidad']);
          if (yaRegistrado) {
            errores.push({
              hoja: filas[i]._hoja || 'Datos',
              fila: i + 2,
              columna: 'Carnet Identidad',
              mensaje: 'El participante con este CI ya está registrado'
            });
            continue;
          }
        }

        await excelRowSchemaDatos.validate(filas[i], { abortEarly: false });
      } catch (validationError) {
        validationError.inner.forEach(err => {
          errores.push({
            hoja: filas[i]._hoja || 'Datos',
            fila: i + 2,
            columna: err.path,
            mensaje: err.message
          });
        });
      }
    }
    return errores;
  };

  const validarFilasAreas = async (filas) => {
    const errores = [];
    for (let i = 0; i < filas.length; i++) {
      try {
        await excelRowSchemaAreas.validate(filas[i], { abortEarly: false });
      } catch (validationError) {
        validationError.inner.forEach(err => {
          errores.push({
            hoja: filas[i]._hoja || 'Areas',
            fila: i + 2,
            columna: err.path,
            mensaje: err.message
          });
        });
      }
    }
    return errores;
  };

  const handleConfirm = (codigoGenerado) => {
    setExcelData([]);
    Swal.fire({
      title: '<h2 style="color:#003366;">Inscripción correctamente realizada</h2>',
      html: `
        <div style="margin: 20px 0;">
          <div style="font-size: 40px; font-weight: bold; color: #555;">${codigoGenerado}</div>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 20px 0;">
            Este es un código único generado para la inscripción realizada, con este código completa los detalles del pago.
            Guarda <strong>este código</strong>, <strong>se envió al correo</strong> de igual manera.
          </p>
        </div>
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button id="goHome" style="background-color:#003366; color:white; border:none; padding:10px 20px; border-radius:8px; font-size:14px;">Ir al inicio</button>
          <button id="viewDetails" style="background-color:#003366; color:white; border:none; padding:10px 20px; border-radius:8px; font-size:14px;">Detalles del pago</button>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        document.getElementById('goHome')?.addEventListener('click', () => {
          navigate("/");
          Swal.close();
        });
        document.getElementById('viewDetails')?.addEventListener('click', () => {
          navigate("/orden-de-pago");
          Swal.close();
        });
      }
    });
  };

  const mostrarErroresValidacion = (errores) => {
    Swal.fire({
      title: 'Errores en el archivo',
      html: `
        <div style="max-height: 400px; overflow-y: auto; text-align: left;">
          ${errores.map(error => `
            <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
              <p><strong>Hoja ${error.hoja}, Fila ${error.fila}</strong></p>
              <p><strong>Campo:</strong> ${error.columna}</p>
              <p style="color: #F44336; display: flex; align-items: center;">
                <span style="margin-right: 8px;"><FaExclamationTriangle /></span>
                ${error.mensaje}
              </p>
              ${error.columna === 'FechaNacimiento' ? 
                '<p style="font-size: 0.9em; color: #666;">Formato esperado: DD/MM/AAAA o AAAA-MM-DD</p>' : ''}
            </div>
          `).join('')}
        </div>
      `,
      confirmButtonText: 'Entendido',
      width: '800px'
    });
  };

  const mostrarResultados = (resultados) => {
    const exitosos = resultados.filter(item => item.success);
    const fallidos = resultados.filter(item => !item.success);

    Swal.fire({
      title: 'Resultado del Registro',
      html: `
        <div style="text-align: left; max-height: 60vh; overflow-y: auto;">
          <div style="margin-bottom: 20px;">
            <h3 style="color: #4CAF50; display: flex; align-items: center;">
              <FaCheckCircle style="margin-right: 8px;" />
              Registros Exitosos: ${exitosos.length}
            </h3>
            ${exitosos.slice(0, 5).map(item => `
              <div style="display: flex; align-items: center; margin: 5px 0; color: #4CAF50;">
                <span style="margin-right: 10px;"><FaCheck /></span>
                <span>Fila ${item.fila}: ${item.nombre || 'Participante'} (CI: ${item.ci_participante_excel})</span>
              </div>
            `).join('')}
            ${exitosos.length > 5 ? `<p style="color: #4CAF50;">...y ${exitosos.length - 5} registros más</p>` : ''}
          </div>
          
          <div>
            <h3 style="color: #F44336; display: flex; align-items: center;">
              <FaTimes style="margin-right: 8px;" />
              Registros Fallidos: ${fallidos.length}
            </h3>
            ${fallidos.slice(0, 5).map(item => `
              <div style="margin: 5px 0; color: #F44336;">
                <div style="display: flex; align-items: center;">
                  <span style="margin-right: 10px;"><FaTimes /></span>
                  <span>Fila ${item.fila}: ${item.error || 'Error desconocido'}</span>
                </div>
                ${item.ci_participante_excel ? `<div style="font-size: 0.9em; margin-left: 24px;">CI: ${item.ci_participante_excel}</div>` : ''}
              </div>
            `).join('')}
            ${fallidos.length > 5 ? `<p style="color: #F44336;">...y ${fallidos.length - 5} registros más</p>` : ''}
          </div>
        </div>
      `,
      width: '800px',
      confirmButtonText: 'Continuar',
      customClass: {
        popup: 'resultados-popup'
      }
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "Archivo requerido",
        text: "Debes cargar un archivo Excel antes de registrar",
        showConfirmButton: true
      });
      return;
    }

    const leerExcel = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            
            const hojaDatos = XLSX.utils.sheet_to_json(workbook.Sheets['Datos'] || {}, {
              raw: false,
              dateNF: 'yyyy-mm-dd'
            }).filter(fila => fila['id_grado'] !== 0 && fila['id_grado'] !== '0' && fila['Carnet tutor']);

            const hojaAreas = XLSX.utils.sheet_to_json(workbook.Sheets['Areas'] || {}, {
              raw: false,
              dateNF: 'yyyy-mm-dd'
            }).filter(fila => fila['id_grado'] !== 0 && fila['id_grado'] !== '0' && fila['Carnet tutor']);

            const filasConHojaDatos = hojaDatos.map(fila => ({ ...fila, _hoja: 'Datos' }));
            const filasConHojaAreas = hojaAreas.map(fila => ({ ...fila, _hoja: 'Areas' }));

            const erroresDatos = await validarFilasDatos(filasConHojaDatos);
            const erroresAreas = await validarFilasAreas(filasConHojaAreas);
            
            resolve([...erroresDatos, ...erroresAreas]);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    };

    try {
      const errores = await leerExcel(selectedFile);
      if (errores.length > 0) {
        setExcelData([]);
        mostrarErroresValidacion(errores);
        return;
      }

      // Verificación del tutor en tiempo real
      let tutorData = null;
      let tutorVerificado = false;

      const { value: formValues } = await Swal.fire({
        title: 'Datos del Responsable de pago',
        html: `
          <input id="ci" class="swal2-input" placeholder="N° de documento" maxlength="9" 
                 oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
          <input id="comp" class="swal2-input" placeholder="Complemento CI" maxlength="2" />
          <input id="nombres" class="swal2-input" placeholder="Nombre del responsable" maxlength="50" />
          <input id="apellidos" class="swal2-input" placeholder="Apellidos del responsable" maxlength="50" />
          <input id="correo" class="swal2-input" placeholder="Correo del responsable" type="email" />
          <input id="telefono" class="swal2-input" placeholder="Teléfono del responsable" maxlength="8" 
                 oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
        `,
        focusConfirm: false,
        confirmButtonText: 'Continuar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        didOpen: () => {
          const ciInput = document.getElementById('ci');
          
          ciInput.addEventListener('input', async (e) => {
            const ci = e.target.value.trim();
            if (ci.length >= 5) {
              try {
                ciInput.disabled = true;
                Swal.showLoading();
                
                const data = await new Promise((resolve, reject) => {
                  verificarTutor(ci, resolve, reject);
                });

                if (data) {
                  tutorData = data;
                  tutorVerificado = true;
                  Swal.hideLoading();
                  
                  const { isConfirmed } = await Swal.fire({
                    icon: 'success',
                    title: 'Tutor encontrado',
                    html: `
                      <p>Se encontró un tutor registrado:</p>
                      <p><strong>Nombre:</strong> ${data.nombresTutor} ${data.apellidosTutor}</p>
                      <p><strong>CI:</strong> ${data.carnetIdentidadTutor} ${data.complementoCiTutor || ''}</p>
                    `,
                    confirmButtonText: 'Usar estos datos',
                    showCancelButton: true,
                    cancelButtonText: 'Ingresar manualmente'
                  });

                  if (isConfirmed) {
                    document.getElementById('nombres').value = data.nombresTutor || '';
                    document.getElementById('apellidos').value = data.apellidosTutor || '';
                    document.getElementById('correo').value = data.emailTutor || '';
                    document.getElementById('telefono').value = data.telefono || '';
                    document.getElementById('comp').value = data.complementoCiTutor || '';
                  }
                }
              } catch (error) {
                console.log('Tutor no encontrado:', error);
              } finally {
                ciInput.disabled = false;
                Swal.hideLoading();
              }
            }
          });
        },
        preConfirm: () => {
          const ci = document.getElementById('ci').value.trim();
          if (!ci) {
            Swal.showValidationMessage('El número de documento es obligatorio');
            return false;
          }

          if (!tutorVerificado) {
            const nombres = document.getElementById('nombres').value.trim();
            const apellidos = document.getElementById('apellidos').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            
            if (!nombres || !apellidos || !correo || !telefono) {
              Swal.showValidationMessage('Por favor, complete todos los campos obligatorios');
              return false;
            }
          }

          return {
            ci,
            comp: document.getElementById('comp').value.trim(),
            nombres: tutorVerificado ? tutorData.nombresTutor : document.getElementById('nombres').value.trim(),
            apellidos: tutorVerificado ? tutorData.apellidosTutor : document.getElementById('apellidos').value.trim(),
            correo: tutorVerificado ? tutorData.emailTutor : document.getElementById('correo').value.trim(),
            telefono: tutorVerificado ? tutorData.telefono : document.getElementById('telefono').value.trim(),
            tutorVerificado
          };
        }
      });

      if (!formValues) return;

      Swal.fire({
        title: "Procesando archivo...",
        text: "Estamos registrando los participantes",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        const res = await postOnlyExcelFile(selectedFile);
        const result = await res.data;
        
        if (Array.isArray(result)) {
          const resultadosFiltrados = result.filter(item => 
            !(item.error && item.error.includes('violates foreign key constraint'))
          );

          mostrarResultados(resultadosFiltrados);

          const primerExitoso = resultadosFiltrados.find(item => item.success);
          if (primerExitoso) {
            const tutorPayload = {
              idTutorParentesco: 2,
              tutors: [{
                idTipoTutor: 3,
                emailTutor: formValues.correo,
                nombresTutor: formValues.nombres,
                apellidosTutor: formValues.apellidos,
                telefono: Number(formValues.telefono),
                carnetIdentidadTutor: Number(formValues.ci),
                complementoCiTutor: formValues.comp
              }]
            };

            await registerTutor(primerExitoso.ci_participante_excel, tutorPayload);
            const forModal = await getInscripcionByID(primerExitoso.id_inscripcion);
            handleConfirm(forModal.data.data.codigoUnicoInscripcion);
          }
        }
      } catch (error) {
        console.error("Error al procesar el archivo:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error en el proceso',
          text: error.message || 'Ocurrió un error al procesar el archivo',
          confirmButtonText: 'Entendido'
        });
      } finally {
        Swal.hideLoading();
      }
    } catch (error) {
      console.error("Error al procesar el archivo Excel:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Hubo un problema al leer o validar el archivo',
        confirmButtonText: 'Entendido'
      });
      setExcelData([]);
    }
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="excel-upload-container">
        <div className="upload-left">
          <h3>Carga de Participantes desde Excel</h3>
          <p>Sube un archivo Excel con los datos de múltiples los participantes siguiendo el formato requerido.</p>
          <p>Puede subir hasta 600 participantes</p>

          <div className="upload-and-archive">
            <input id="file" name="file" type="file" accept=".xlsx"
              onChange={handleFileChange}
              className="input-file"
              ref={fileInputRef}
            />
            <ButtonPrimary type="button" onClick={() => fileInputRef.current.click()}>
              <FaUpload className="icon" />
              &emsp; Subir archivo Excel
            </ButtonPrimary>

            {formik.values.file && (        
              <div className="file-info"> 
                <RiFileExcel2Line style={{ color: '#22c55e', fontSize: '18px' }} />
                <span
                  style={{ maxWidth: '30vh', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  title={formik.values.file.name}
                >
                  {formik.values.file.name}
                </span>
                <span className="file-size">{(formik.values.file.size / (1024 * 1024)).toFixed(1)} Mb</span>
              </div>
            )}

            {formik.errors.file && formik.touched.file && (
              <div className="error-message">{formik.errors.file}</div>
            )}
          </div>
          <p className="formats">Formatos soportados: .xlsx, .xls (máximo 7 mb)</p>
          {selectedFile && (
            <ButtonPrimary className="btn-loading" type="submit" disabled={buttonState === 'loading'}>
              {buttonState === 'loading' ? (
                <div className="btn-loader-active"></div>
              ) : buttonState === 'done' ? (
                <FaCheck className="icon" />
              ) : (
                <FaUpload className="icon" />
              )}
              &emsp;
              {buttonState === 'loading'
                ? 'Cargando...'
                : buttonState === 'done'
                ? 'Archivo cargado'
                : 'Cargar datos'}
            </ButtonPrimary>
          )}
        </div>

        <div className="upload-right">
          <div className="tips-header">
            <h4>Recomendaciones de Formato</h4>
            <span className="tips-label">TIPS</span>
          </div>
          <p>Utilice la plantilla personalizada, en la Hoja de <strong>'Datos'</strong> ingrese la información del participante y tutor
            legal. En la hoja de <strong>'Areas'</strong> asigne las áreas a las que postulará el participante seguido de la información
            del profesor.
          </p>
          
          <a href={plantilla} download className="download-template">
            <FaDownload /> Descargar plantilla
          </a>
        </div>
      </form>

      {excelData.length > 0 && (
        <div className="table-container">
          <h3>Listado de Participantes Cargados</h3>
          <Table data={excelData} columns={columnas} />
        </div>
      )}
      <div style={{display: "flex", justifyContent:"flex-end"}}>
        <ButtonPrimary type='submit' onClick={handleSubmit}>
          Registrar participantes
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default UpdateExcel;