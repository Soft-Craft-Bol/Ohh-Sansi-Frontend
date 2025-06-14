import React, { useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { FaUpload, FaDownload, FaCheck } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { ButtonPrimary } from '../button/ButtonPrimary';
import './LoadExcel.css';
import Swal from 'sweetalert2';
import plantilla from '../../assets/Plantilla-De-Inscipción-v3.xlsx';
import Table from '../table/Table';
import { getInscripcionByID, postOnlyExcelFile, registerTutor, getPeriodoInscripcionActal } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { verificarTutor } from '../../hooks/loaderInfo/LoaderInfo';
import { leerExcelHoja2 } from '../../hooks/excel/useMappingDataExcel';
import { getSchemas } from '../../schemas/ExcelValidation';

const validExtensions = ['.xlsx'];
const columnasPermitidas = ['Nombres de Participante', 'Carnet Identidad', 'Grado', 'Departamento', 'Colegio'];
const columnas = columnasPermitidas.map((col) => ({
  header: col,
  accessor: col
}));

const UpdateExcel = () => {
  const fileInputRef = useRef(null);
  const [schemas, setSchemas] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [buttonState, setButtonState] = useState('upload');
  const navigate = useNavigate();


useEffect(() => {
  const loadSchemas = async () => {
    try {
      const loadedSchemas = await getSchemas();
      setSchemas(loadedSchemas);
    } catch (error) {
      console.error("Error loading validation schemas:", error);
    }
  };
  
  loadSchemas();
}, []);

  // Formik configuration
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
    
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
        
          const hoja1 = workbook.Sheets['Datos'];
          const jsonHoja1 = XLSX.utils.sheet_to_json(hoja1);
        
          const participantes = jsonHoja1.map((row) => {
            const nuevo = {};
            columnasPermitidas.forEach((col) => {
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
        } catch (error) {
          console.error('Error al procesar archivo:', error);
          Swal.fire({
            icon: "error",
            title: "Error al procesar archivo",
            text: "Ocurrió un error al leer el archivo Excel",
            showConfirmButton: false,
            timer: 2500,
          });
          setSubmitting(false);
          setButtonState('error');
        }
      };
      reader.readAsArrayBuffer(file);
    },
  });

  // Manejar cambio de archivo
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

    const limpiarFilasVacias = (filas) => {
    return filas.filter(fila => {
      // Considera una fila válida si tiene al menos un campo importante con datos
      const camposImportantes = ['Nombres', 'Apellido Paterno', 'Carnet Identidad'];
      
      return camposImportantes.some(campo => {
        const valor = fila[campo];
        return valor && 
              valor.toString().trim() !== '' && 
              valor !== 0 && 
              valor !== '0';
      });
     });
    };

  const validarFilasDatos = async (filas) => {
  if (!schemas) return [];
  
  const errores = [];
  
  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];
    try {
      await schemas.excelRowSchemaDatos.validate(fila, { abortEarly: false });
    } catch (validationError) {
      if (validationError.inner) {
        validationError.inner.forEach(err => {
          errores.push({
            hoja: fila._hoja || 'Datos',
            fila: i + 2,
            columna: err.path,
            mensaje: err.message
          });
        });
      }
    }
  }
  return errores;
};

const validarFilasAreas = async (filas) => {
  if (!schemas) return [];
  
  const errores = [];
  for (let i = 0; i < filas.length; i++) {
    try {
      await schemas.excelRowSchemaAreas.validate(filas[i], { abortEarly: false });
    } catch (validationError) {
      if (validationError.inner) {
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
  }
  return errores;
};

 
  const leerExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        
        // Función para verificar si una fila es inválida
        const esFilaInvalida = (fila) => {
          const ci = fila['Carnet tutor'];
          return !ci || String(ci).trim() === '' || ci === 0;
        };

        // Obtener todas las filas y excluir la última si está vacía
        let hojaDatosRaw = XLSX.utils.sheet_to_json(workbook.Sheets['Datos'] || {});
        
        // Eliminar la última fila si está vacía o es inválida
        if (hojaDatosRaw.length > 0) {
          const ultimaFila = hojaDatosRaw[hojaDatosRaw.length - 1];
          if (esFilaInvalida(ultimaFila) || 
              (!ultimaFila['Nombres'] && !ultimaFila['Carnet Identidad'])) {
            hojaDatosRaw = hojaDatosRaw.slice(0, -1);
          }
        }

        // Filtrar filas con id_grado válido
        hojaDatosRaw = hojaDatosRaw.filter(fila => fila['id_grado'] !== 0 && fila['id_grado'] !== '0');
        let hojaAreasRaw = [...hojaDatosRaw]; // Usamos los mismos datos ya filtrados

        // Limpieza adicional: Eliminar filas completamente vacías
        hojaDatosRaw = limpiarFilasVacias(hojaDatosRaw);
        hojaAreasRaw = limpiarFilasVacias(hojaAreasRaw);

        const hojaDatos = hojaDatosRaw.filter(fila => !esFilaInvalida(fila));

        // Convertir fechas
        const convertirFechas = (fila) => {
          const copia = { ...fila };
          if (typeof copia.FechaNacimiento === 'number') {
            const serial = copia.FechaNacimiento;
            const utc_days = Math.floor(serial - 25569);
            const utc_value = utc_days * 86400;
            copia.FechaNacimiento = new Date(utc_value * 1000);
          }
          return copia;
        };

        const filasConHojaDatos = hojaDatos.map(fila => ({ ...convertirFechas(fila), _hoja: 'Datos' }));

        const erroresDatos = await validarFilasDatos(filasConHojaDatos);
        const erroresAreas = await validarFilasAreas(filasConHojaDatos);
        
        const erroresTotales = [...erroresDatos, ...erroresAreas];
        resolve(erroresTotales);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

  const mostrarErrores = (errores) => {
    const erroresPorHoja = errores.reduce((acc, error) => {
      const hoja = error.hoja || 'Desconocida';
      if (!acc[hoja]) acc[hoja] = [];
      acc[hoja].push(`Fila ${error.fila}, Columna "${error.columna}": ${error.mensaje}`);
      return acc;
    }, {});

    let htmlErrores = '';
    for (const hoja in erroresPorHoja) {
      htmlErrores += `<h3 style="margin-top: 10px; font-size: 16px;">Hoja: ${hoja}</h3><ul>`;
      erroresPorHoja[hoja].forEach(err => {
        htmlErrores += `<li style="text-align: left; font-size: 14px;">${err}</li>`;
      });
      htmlErrores += '</ul>';
    }

    Swal.fire({
      title: 'Errores de validación en el archivo Excel. Corríjalos para poder subirlo',
      html: htmlErrores,
      icon: 'error',
      width: 800,
      customClass: {
        htmlContainer: 'scrollable-swals',
      },
      showConfirmButton: true
    });
  };

  // Mostrar resultados 
  const mostrarResultados = async (resultados) => {
  const resultadosFiltrados = resultados.filter(item => {
    if (!item) return false;
    
    // Excluir errores no deseados y undefined
    if (!item.error || 
        item.error.includes('omitida') || 
        item.error.includes('undefined') ||
        item.error.includes('Desconocido') ||
        item.fila === 'No especificada') {
      return false;
    }
    
    return true;
  });

  const exitosos = resultadosFiltrados.filter(item => item?.success);
  const errores = resultadosFiltrados.filter(item => !item?.success && item.error && item.fila);

  // Modal de éxito si hay registros correctos
  if (exitosos.length > 0) {
    await Swal.fire({
      title: '¡Registro exitoso!',
      html: `
        <div style="text-align: center;">
          <div style="font-size: 48px; color: #4CAF50; margin-bottom: 20px;">
            <i class="fas fa-check-circle"></i>
          </div>
          <p style="font-size: 18px; margin-bottom: 10px;">
            <strong>${exitosos.length}</strong> participante${exitosos.length > 1 ? 's' : ''} 
            registrado${exitosos.length > 1 ? 's' : ''} correctamente
          </p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Continuar'
    });

    // Modal de confirmación con código
    if (exitosos.length > 0) {
      const participanteExitoso = exitosos[0];
      try {
        const forModal = await getInscripcionByID(participanteExitoso.id_inscripcion);
        handleConfirm(forModal.data.data.codigoUnicoInscripcion);
      } catch (error) {
        console.error("Error al obtener datos para el modal:", error);
      }
    }
  }

  // Modal de errores
  if (errores.length > 0) {
    let htmlErrores = `
      <div style="max-height: 60vh; overflow-y: auto; text-align: left;">
        <h4 style="color: #F44336; margin-bottom: 15px;">Errores encontrados:</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
    `;

    errores.forEach(error => {
      if (error.fila && error.error) { // Doble verificación
        htmlErrores += `
          <div style="padding: 8px; background: #fff3f3; border-radius: 4px;">
            <strong>Fila ${error.fila}:</strong> ${error.error}
          </div>
        `;
      }
    });

    htmlErrores += `
        </div>
        <p style="margin-top: 15px; color: #666; font-size: 14px;">
          Total de errores: ${errores.length}
        </p>
      </div>
    `;

    await Swal.fire({
      title: 'Errores en el archivo',
      html: htmlErrores,
      width: '700px',
      confirmButtonText: 'Entendido',
      icon: 'error'
    });
  }
};

  // Manejar confirmación de inscripción
  const handleConfirm = (codigoGenerado) => {
    setExcelData([]);
    setSelectedFile(null);
    setButtonState('upload');
    formik.resetForm();
    
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

  const handleSubmit = async () => {
    if (!selectedFile) {
      Swal.fire("Archivo requerido", "Debes cargar un archivo Excel antes de registrar", "warning");
      return;
    }
    const {hojita1, hojita2} = leerExcelHoja2(selectedFile);
    try{
      const response = await getPeriodoInscripcionActal()
      const actualPeriodo = response.data.olimpiada;
      if(actualPeriodo.nombreEstado !== "EN INSCRIPCION"){
        Swal.fire({
          icon: "info",
          title: "Periodo de inscripción cerrado",
          text: "No se puede registrar participantes en este momento.",
          confirmButtonText: "Aceptar"
        });
        return;
      }
    
      try {
      const errores = await leerExcel(selectedFile);
      if (errores.length > 0) {
        mostrarErrores(errores);
        return;
      }
      

      const { value: ciTutor } = await Swal.fire({
        title: 'Ingrese el CI del Responsable de pago',
        input: 'text',
        inputPlaceholder: 'Número de documento',
        inputAttributes: {
          maxlength: 9,
          oninput: "this.value = this.value.replace(/[^0-9]/g, '')"
        },
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      });

      if (!ciTutor) return;

      let tutorData = null;
      try {
        tutorData = await new Promise((resolve, reject) => {
          verificarTutor(ciTutor, resolve, reject);
        });
      } catch (error) {
        Swal.fire({
          icon: "info",
          title: "Tutor no encontrado",
          text: "Se procederá a registro manual"
        });
      }

      let formValues = null;
      if (tutorData) {
        // Mostrar confirmación para usar datos del tutor encontrado
        const { value: confirmar } = await Swal.fire({
          title: 'Tutor encontrado',
          html: `
            <p>Se encontró un tutor registrado con los siguientes datos:</p>
            <p><strong>Nombre:</strong> ${tutorData.nombresTutor} ${tutorData.apellidosTutor}</p>
            <p><strong>CI:</strong> ${tutorData.carnetIdentidadTutor} ${tutorData.complementoCiTutor || ''}</p>
            <p><strong>Teléfono:</strong> ${tutorData.telefono}</p>
            <p><strong>Correo:</strong> ${tutorData.emailTutor}</p>
          `,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Usar estos datos',
          cancelButtonText: 'Ingresar manualmente'
        });

        if (confirmar) {
          formValues = {
            ci: tutorData.carnetIdentidadTutor,
            comp: tutorData.complementoCiTutor || '',
            nombres: tutorData.nombresTutor,
            apellidos: tutorData.apellidosTutor,
            correo: tutorData.emailTutor,
            telefono: tutorData.telefono
          };
        }
      }

      // Si no se confirmó el tutor automático o no se encontró, pedir datos manualmente
      if (!formValues) {
        const { value: valores } = await Swal.fire({
          title: 'Datos del Responsable de pago',
          html: `
            <input id="ci" class="swal2-input" placeholder="N° de documento" maxlength="9" value="${ciTutor || ''}" 
                   oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
            <input id="comp" class="swal2-input" placeholder="Complemento CI" maxlength="2" />
            <input id="nombres" class="swal2-input" placeholder="Nombre del responsable" maxlength="50" />
            <input id="apellidos" class="swal2-input" placeholder="Apellidos del responsable" maxlength="50" />
            <input id="correo" class="swal2-input" placeholder="Correo del responsable" type="email" />
            <input id="telefono" class="swal2-input" placeholder="Teléfono del responsable" maxlength="8" 
                   oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
          `,
          focusConfirm: false,
          confirmButtonText: 'Registrar Responsable de pago',
          preConfirm: () => {
            const ci = document.getElementById('ci').value.trim();
            const comp = document.getElementById('comp').value.trim();
            const nombres = document.getElementById('nombres').value.trim();
            const apellidos = document.getElementById('apellidos').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const telefono = document.getElementById('telefono').value.trim();

            if (!ci || !nombres || !apellidos || !correo || !telefono) {
              Swal.showValidationMessage('Por favor, complete todos los campos obligatorios');
              return false;
            }

            return { ci, comp, nombres, apellidos, correo, telefono };
          }
        });

        if (!valores) return;
        formValues = valores;
      }

      // Procesar el archivo
      const { value: confirm } = await Swal.fire({
        title: '¿Está seguro de registrar los participantes?',
        text: 'Esta acción no se puede deshacer',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar'
      });

      if (!confirm) return;

      Swal.fire({
        title: "Subiendo archivo...",
        text: "Espere un momento mientras se procesa",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const res = await postOnlyExcelFile(selectedFile);
        
        if (!res || !res.data) {
          throw new Error('Respuesta inválida del servidor');
        }

        const result = Array.isArray(res.data) ? res.data : [res.data];
        
        Swal.close();

        // Filtrar errores de foreign key como en el código antiguo
        const erroresFiltrados = result.filter(item => {
          if (!item) return false;
          if (item.error && item.error.includes('violates foreign key constraint')) {
            return false;
          }
          return true;
        });

        // Mostrar resultados
        await mostrarResultados(erroresFiltrados);

        // Preparar payload del tutor
        const tutorPayload = {
          idTutorParentesco: 2,
          tutors: [
            {
              idTipoTutor: 3,
              emailTutor: formValues.correo,
              nombresTutor: formValues.nombres,
              apellidosTutor: formValues.apellidos,
              telefono: Number(formValues.telefono),
              carnetIdentidadTutor: Number(formValues.ci),
              complementoCiTutor: formValues.comp
            }
          ]
        };

        // Buscar el primer participante exitoso para registro de tutor
        const participanteExitoso = result.find(item => item?.success);
        if (participanteExitoso) {
          try {
            await registerTutor(participanteExitoso.ci_participante_excel, tutorPayload);
            const forModal = await getInscripcionByID(participanteExitoso.id_inscripcion);
            handleConfirm(forModal.data.data.codigoUnicoInscripcion);
          } catch (error) {
            console.error("Error al registrar tutor:", error);
          }
        }
      } catch (error) {
        console.error("Error al enviar archivo:", error);
        Swal.close();
        Swal.fire({
          title: "Error",
          text: "No se pudo enviar el archivo. Por favor, intente nuevamente.",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error al procesar el archivo Excel:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al leer o validar el archivo",
        icon: "error"
      });
    }
    }catch (error) {
      console.error("Error al obtener el periodo de inscripción:", error);

        let errorMessage = "Ocurrió un error al verificar el estado de la inscripción.";

        if (error.response) {
            console.error("Error de respuesta del servidor:", error.response.status, error.response.data);
            if (error.response.status === 404) {
                errorMessage = "Endpoint no encontrado o periodo de inscripción no configurado.";
            } else if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message; // Mensaje de error personalizado del backend
            } else {
                errorMessage = `Error del servidor: ${error.response.status}`;
            }
        } else if (error.request) {
            console.error("No se recibió respuesta del servidor:", error.request);
            errorMessage = "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet o intenta más tarde.";
        } else {
            console.error("Error desconocido al configurar la solicitud:", error.message);
            errorMessage = `Error inesperado: ${error.message}`;
        }

        Swal.fire(
            "Error de Conexión",
            errorMessage,
            "error"
        );
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
          <p className="formats">Formatos soportados: .xlsx, .xls (máximo 3 mb)</p>
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
          <p>Utilice la plantilla personalizada, en la Hoja de <strong>'Datos'</strong> ingrese la información del participante
           y asigne las áreas a las que postulará; seguido de la información
            del profesor. Tome en cuenta la olimpiada actual y las áreas habilitadas para el Grado del participante. En caso de tener errores
            se visualizarán al intentar subir el archivo
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
      
      <div style={{display: "flex", justifyContent: "flex-end"}}>
        <ButtonPrimary type='button' onClick={handleSubmit}>
          Registrar participantes
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default UpdateExcel;