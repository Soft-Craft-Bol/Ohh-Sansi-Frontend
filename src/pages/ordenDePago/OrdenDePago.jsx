import React, { useState, useEffect } from 'react';
import "./OrdenDePago.css";
import Header from "../../components/header/Header";
import { FaSearch } from 'react-icons/fa';
import OrdenPagoDetalle from "../../components/ordenPagoDetalle/OrdenPagoDetalle";
import { getOrdenPagoDetailInfo, createOrdenPago } from "../../api/api";
const convertirNumeroAPalabras = (numero) => {
  const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const especiales = ['ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  
  const num = Math.floor(numero);
  
  if (num === 0) return 'CERO';
  if (num < 10) return unidades[num];
  if (num < 20) return especiales[num - 11];
  if (num < 100) {
    const decena = Math.floor(num / 10);
    const unidad = num % 10;
    return decenas[decena] + (unidad !== 0 ? ' Y ' + unidades[unidad] : '');
  }
  if (num === 100) return 'CIEN';
  if (num < 1000) {
    const centena = Math.floor(num / 100);
    const resto = num % 100;
    return (centena === 1 ? 'CIENTO' : unidades[centena] + 'CIENTOS') + 
           (resto !== 0 ? ' ' + convertirNumeroAPalabras(resto) : '');
  }
  return 'NÚMERO GRANDE';
};

const OrdenDePago = () => {
  const [inputValue, setInputValue] = useState("");
  const [codigoIntroducido, setCodigoIntroducido] = useState("");
  const [ordenData, setOrdenData] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [ordenGenerada, setOrdenGenerada] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setCodigoIntroducido(inputValue.trim());
      setInputValue("");
      setError(null);
    }
  };

  useEffect(() => {
    const fetchOrdenData = async () => {
      if (codigoIntroducido) {
        try {
          const response = await getOrdenPagoDetailInfo(codigoIntroducido);
          setOrdenData(response.data);
          setMostrarDetalle(false);
          setOrdenGenerada(null);
          console.log("Datos recibidos:", response.data);
        } catch (error) {
          console.error("Error al obtener los datos:", error.response?.data || error.message);
          setOrdenData(null);
          setError("No se encontró la inscripción con el código proporcionado");
        }
      }
    };
    fetchOrdenData();
  }, [codigoIntroducido]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") handleSearch();
  };

  const handleGenerarOrden = async () => {
    if (!ordenData) return;
  
    try {
      const primeraInscripcion = ordenData.inscripcion?.[0]; // Accede al primer elemento
      if (!primeraInscripcion) {
        throw new Error("No se encontró información de inscripción");
      }
  
      const areas = ordenData.areas || [];
      const primerTutor = ordenData.tutores?.[0] || {};
  
      const cantidadAreas = areas.length;
      const precioPorArea = 35;
      const montoTotalPago = cantidadAreas * precioPorArea;
  
      const fechaActual = new Date();
      const fechaEmision = fechaActual.toISOString().split("T")[0];
      const fechaVencimiento = new Date(fechaActual);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 14);
      const fechaVencimientoStr = fechaVencimiento.toISOString().split("T")[0];
  
      const montoLiteral = convertirNumeroAPalabras(montoTotalPago);
      const centavos = (montoTotalPago % 1).toFixed(2).split('.')[1];
  
      const nuevaOrden = {
        idInscripcion: primeraInscripcion.id_inscripcion, // Usamos el id correcto aquí
        idMetodoPago: 1,
        idEstado: 1,
        fechaEmisionOrdenPago: fechaEmision,
        fechaVencimiento: fechaVencimientoStr,
        montoTotalPago: montoTotalPago,
        codOrdenPago: `N°${Math.floor(1000000 + Math.random() * 9000000)}`,
        emisor: "FACULTAD CIENCIAS Y TECNOLOGIA",
        precioLiteral: `${montoLiteral} ${centavos}/100`,
        responsablePago: `${primerTutor.nombres_tutor || ""} ${primerTutor.apellidos_tutor || ""}`.trim(),
        cantidad: cantidadAreas,
        concepto: "Pago de matrícula",
        precio_unitario: precioPorArea,
      };
  
      console.log("Enviando orden:", nuevaOrden);
  
      const response = await createOrdenPago(nuevaOrden);
      setOrdenGenerada(response.data);
      setMostrarDetalle(true);
      setError(null);
      
    } catch (error) {
      console.error("Error completo:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const renderInputSection = () => (
    <div className="buscador-codigo">
      <p>Genera la orden de pago referente a la inscripción, introduciendo el código</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Introduce el código"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <FaSearch className="search-icon" onClick={handleSearch} />
      </div>
      <div className="cont-cod-int">
        <p className="code-text">Código introducido: </p>
        <span className="codigo-introducido">{codigoIntroducido || "sin código"}</span>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );

  const renderInfoSection = () => {
    if (!ordenData) return null;

    const participantes = ordenData.participantes || [];
    const areas = ordenData.areas || [];
    const tutores = ordenData.tutores || [];

    const totalParticipantes = participantes.length;
    const totalAreas = areas.length;

    const primerTutor = tutores.length > 0 ? tutores[0] : null;
    const nombreResponsable = primerTutor
      ? `${primerTutor.nombres_tutor || ""} ${primerTutor.apellidos_tutor || ""}`.trim()
      : "No disponible";
    const correoResponsable = primerTutor?.email_tutor || "No disponible";

    const costoPorArea = 35;
    const totalAPagar = totalAreas * costoPorArea;

    return (
      <div className='info-box'>
        <div className='resumen'>
          <h3>Resumen de la inscripción</h3>
          <p>Total de participantes: <span className="bold-blue">{totalParticipantes}</span></p>
          <p>Total áreas inscritas: <span className="bold-blue">{totalAreas}</span></p>
          <p>Nombre del responsable: <span className="bold-blue">{nombreResponsable}</span></p>
          <p>Correo del responsable: <span className="bold-blue">{correoResponsable}</span></p>
        </div>
        <div className='divider'></div>
        <div className='pago'>
          <h3>Detalles del pago</h3>
          <p>Costo por área: <span className="bold-blue">{costoPorArea} bs.</span></p>
          <p className='total-pagar'>Total a pagar: </p>
          <span className="big-bold-blue">{totalAPagar} bs.</span>
        </div>
      </div>
    );
  };

  return (
    <div className="orden-de-pago">
      <Header
        title="Generación de Orden de Pago"
        description="Genera la orden de pago para el participante previamente inscrito en la olimpiada, buscando con el código de inscripción brindado al finalizar el registro."
      />
      <div className="top-container">
        <h2>Generar orden de pago</h2>
        {renderInputSection()}
      </div>
      <div className='info-container'>
        {renderInfoSection()}
        {ordenData && !mostrarDetalle && (
          <div className='boton-generar'>
            <button onClick={handleGenerarOrden} className="btn-generar">
              Generar Orden de Pago
            </button>
          </div>
        )}
      </div>
      {mostrarDetalle && ordenGenerada && (
        <div className='orden-detail'>
          <OrdenPagoDetalle data={ordenGenerada} />
        </div>
      )}
    </div>
  );
};

export default OrdenDePago;