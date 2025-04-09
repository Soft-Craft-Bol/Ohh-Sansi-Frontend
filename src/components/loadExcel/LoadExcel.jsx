import React from 'react'
import { FaUpload, FaDownload } from "react-icons/fa";
import './LoadExcel.css'
import { RiFileExcel2Line } from 'react-icons/ri';
export default function LoadExcel() {
    return (
        <div className="excel-upload-container">
          <div className="upload-left">
            <h3>Carga de Participantes desde Excel</h3>
            <p>Sube un archivo Excel con los datos de múltiples los participantes siguiendo el formato requerido.</p>
            <p>Puede subir hasta 600 participantes</p>
            <div>
                <button className="upload-button">
              <FaUpload className="icon" />
              Subir Archivo Excel
            </button>
    
            <div className="file-info">
              <RiFileExcel2Line className="excel-icon" />
              <span>archivoExcel.xlsx</span>
              <span className="file-size">2.3 Mb</span>
            </div>
            </div>
            
            <p className="formats">Formatos soportados: .xlsx, .xls, .csv, .xsb (máximo 7 mb)</p>
          </div>
    
          <div className="upload-right">
            <div className="tips-header">
              <h4>Recomendaciones de Formato</h4>
              <span className="tips-label">TIPS</span>
            </div>
            <p>El archivo Excel o de celdas debe contener las siguientes columnas:</p>
            <ul className="tips-list">
              <li>• Nombres y apellidos</li>
              <li>• Número de documento</li>
              <li>• Fecha de nacimiento</li>
              <li>• Datos del colegio</li>
              <li>• Áreas de competencia</li>
              <li>• Correo electrónico</li>
              <li>• Demás campos</li>
            </ul>
            <a href="#" className="download-template">
              <FaDownload /> Descargar plantilla
            </a>
          </div>
        </div>
      );
}

