import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { FaUpload, FaDownload, FaCheck } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { ButtonPrimary } from '../button/ButtonPrimary';
import './LoadExcel.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import plantilla from '../../assets/PlantillaParticipante.xlsx';
import Table from '../table/Table';

const validExtensions = ['.xlsx'];
const columnasPermitidas = ['Nombres', 'Apellido Paterno', 'Apellido Materno', 'Departamento', 'Colegio', 'Carnet Identidad'];
const columnas = columnasPermitidas.map((col) => ({
  header: col,
  accessor: col
}));


const LoadExcel = () => {
  const fileInputRef = useRef(null);
  const [excelData, setExcelData] = useState([]);
  const [buttonState, setButtonState] = useState('upload'); // 'upload', 'loading', 'done'
  const navigate = useNavigate();

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
      
        // HOJA 1 - Participantes
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
      
        // Procesar la hoja 2 para generar JSON
        const sheet2 = workbook.Sheets["Hoja2"];
        if (!sheet2) {
          console.error("No se encontró la Hoja2");
          return;
        }

        const dataHoja2 = XLSX.utils.sheet_to_json(sheet2, { header: 1 });
        const headers = dataHoja2[0];
        const rows = dataHoja2.slice(1);

        const datosParticipantes = [];

        for (const fila of rows) {
          const obj = {};
          headers.forEach((header, i) => {
            let valor = fila[i];

            // mappeo
            if (valor === "true") valor = true;
            if (valor === "false") valor = false;

            obj[header] = valor;
          });
          if (!obj.carnetIdentidadParticipante || obj.carnetIdentidadParticipante === 0) break;

          datosParticipantes.push(obj);
        };
      
        console.log("Participantes de Hoja2:", datosParticipantes);
      
        setSubmitting(false);
        setButtonState('done');
      };
      
    
      reader.readAsArrayBuffer(file);
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
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

  const handleSubmit = (event) => {
    event.preventDefault();
  
    Swal.fire({
      title: '<h2 style="color:#003366;">Inscripción correctamente realizada</h2>',
      html: `
        <div style="margin: 20px 0;">
          <div style="font-size: 40px; font-weight: bold; color: #555;">xa123ca</div>
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
        const goHome = document.getElementById('goHome');
        const viewDetails = document.getElementById('viewDetails');
  
        if (goHome) {
          goHome.addEventListener('click', () => {
            navigate("/home")
            Swal.close();
          });
        }
  
        if (viewDetails) {
          viewDetails.addEventListener('click', () => {
            navigate("/orden-de-pago")
            Swal.close();
          });
        }
      }
    });
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="excel-upload-container">
      <div className="upload-left">
        <h3>Carga de Participantes desde Excel</h3>
        <p>Sube un archivo Excel con los datos de múltiples los participantes siguiendo el formato requerido.</p>
        <p>Puede subir hasta 600 participantes</p>

        <div className="upload-and-archive">
          <input
            id="file"
            name="file"
            type="file"
            accept=".xlsx"
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
              <div>
                
                </div>
              
            </div>
            
          )}

          {formik.errors.file && formik.touched.file && (
            <div className="error-message">{formik.errors.file}</div>
          )}
        </div>
        <p className="formats">Formatos soportados: .xlsx, .xls (máximo 7 mb)</p>
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
      </div>

      <div className="upload-right">
        <div className="tips-header">
          <h4>Recomendaciones de Formato</h4>
          <span className="tips-label">TIPS</span>
        </div>
        <p>Utilice la plantilla personalizada, en la Hoja de Datos ingrese la información del participante y tutor
          legal. En la hoja de Areas asigne las áreas a las que postulará el participante seguido de la información
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

export default LoadExcel;