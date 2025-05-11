import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { FaUpload, FaDownload, FaCheck } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { ButtonPrimary } from '../button/ButtonPrimary';
import './LoadExcel.css';
import Swal from 'sweetalert2';
import plantilla from '../../assets/Plantilla-De-Inscripción.xlsx';
import Table from '../table/Table';
import excelRowSchema from '../../schemas/ExcelValidation';

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
  const [buttonState, setButtonState] = useState('upload'); // 'upload', 'loading', 'done'

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
        const workbook = XLSX.read(data, { type: 'array' });
      
        // Ver los datos de Participantes
        const hoja1 = workbook.Sheets['Datos'];
        const jsonHoja1 = XLSX.utils.sheet_to_json(hoja1);
      
        const columnasHoja1 = ['Nombres', 'Apellido Paterno', 'Apellido Materno', 'Departamento', 'Colegio', 'Carnet Identidad'];
        const participantes = jsonHoja1.map((row) => {
          const nuevo = {};
          columnasHoja1.forEach((col) => {
            nuevo[col] = row[col] ?? '';
          });
          return nuevo;
        });
      
        // Limite de registros
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
    setSelectedFile(file);
    if (!file) return;
    // (3 MB = 3 * 1024 * 1024 bytes)
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

  const validarFilasExcel = async (filas) => {
  const errores = [];

  for (let i = 0; i < filas.length; i++) {
    try {
      await excelRowSchema.validate(filas[i], { abortEarly: false });
    } catch (validationError) {
      validationError.inner.forEach(err => {
        errores.push({
          hoja: filas[i]._hoja || 'Desconocida',  // si no viene definido
          fila: i + 2,
          columna: err.path,
          mensaje: err.message
        });
      });
    }
    }

    return errores;
    };


  const handleSubmit = async () => {
  if (!selectedFile) {
    Swal.fire("Archivo requerido", "Debes cargar un archivo Excel antes de registrar", "warning");
    return;
  }
  const esFilaInvalida = (fila) => {
    const ci = fila['Carnet Identidad'];
    return !ci || String(ci).trim() === '' || ci === 0;
    };
  const leerExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const hojaDatosRaw = XLSX.utils.sheet_to_json(workbook.Sheets['Datos'] || {});
          const hojaAreasRaw = XLSX.utils.sheet_to_json(workbook.Sheets['Areas'] || {});

          const hojaDatos = hojaDatosRaw.filter(fila => !esFilaInvalida(fila));
          const hojaAreas = hojaAreasRaw.filter(fila => !esFilaInvalida(fila));

          const filasConHojaDatos = hojaDatos.map(fila => ({ ...fila, _hoja: 'Datos' }));
          const filasConHojaAreas = hojaAreas.map(fila => ({ ...fila, _hoja: 'Areas' }));

          const erroresDatos = await validarFilasExcel(filasConHojaDatos);
          const erroresAreas = await validarFilasExcel(filasConHojaAreas);

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

  try {
    const errores = await leerExcel(selectedFile);

    if (errores.length > 0) {
      console.log(errores); // Puedes renderizar en tabla o alertar
      Swal.fire("Errores en el archivo", "Corrige los errores antes de continuar", "error");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: 'Datos del Responsable de pago',
      html: `
        <input id="ci" class="swal2-input" placeholder="N° de documento" maxlength="9" />
        <input id="comp" class="swal2-input" placeholder="Complemento CI" maxlength="2" />
        <input id="nombres" class="swal2-input" placeholder="Nombre del responsable" maxlength="50" />
        <input id="apellidos" class="swal2-input" placeholder="Apellidos del responsable" maxlength="50" />
        <input id="correo" class="swal2-input" placeholder="Correo del responsable" type="email" />
        <input id="telefono" class="swal2-input" placeholder="Teléfono del responsable" maxlength="8" />
      `,
      focusConfirm: false,
      confirmButtonText: 'Registrar Tutor',
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

    if (formValues) {
      const formData = new FormData();
      formData.append("archivo", selectedFile);
      formData.append("ci", formValues.ci);
      formData.append("complemento", formValues.comp);
      formData.append("nombres", formValues.nombres);
      formData.append("apellidos", formValues.apellidos);
      formData.append("correo", formValues.correo);
      formData.append("telefono", formValues.telefono);

      // Aquí puedes hacer el envío real
      await fetch("//endpoint del api pendiente", {
        method: "POST",
        body: formData,
      });

      Swal.fire("Éxito", "Archivo y tutor enviados correctamente", "success");
    }

  } catch (error) {
    console.error("Error al procesar el archivo Excel:", error);
    Swal.fire("Error", "Hubo un problema al leer o validar el archivo", "error");
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
                {selectedFile && (<ButtonPrimary className="btn-loading" type="submit" disabled={buttonState === 'loading'}>
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
              </ButtonPrimary>)}
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