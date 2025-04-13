import { useState, useEffect } from 'react';
import { getOrdenPagoDetailInfo, createOrdenPago } from '../../api/api';
import { convertirNumeroAPalabras } from '../../utils/numberUtils';

const useOrdenPago = () => {
  const [inputValue, setInputValue] = useState("");
  const [codigoIntroducido, setCodigoIntroducido] = useState("");
  const [ordenData, setOrdenData] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [ordenGenerada, setOrdenGenerada] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setCodigoIntroducido(inputValue.trim());
      setInputValue("");
      setError(null);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") handleSearch();
  };

  useEffect(() => {
    const fetchOrdenData = async () => {
      if (!codigoIntroducido) return;

      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdenData();
  }, [codigoIntroducido]);

  const handleGenerarOrden = async () => {
    if (!ordenData) return;

    setIsLoading(true);
    try {
      const primeraInscripcion = ordenData.inscripcion?.[0];
      if (!primeraInscripcion) {
        throw new Error("No se encontró información de inscripción");
      }

      const areas = ordenData.areas || [];
      const primerTutor = ordenData.tutores?.[0] || {};

      const cantidadAreas = areas.length;
      const precioPorArea = ordenData.olimpiadas[0]?.precio_olimpiada || 0;
      const montoTotalPago = cantidadAreas * precioPorArea;

      const fechaActual = new Date();
      const fechaEmision = fechaActual.toISOString().split("T")[0];
      const fechaVencimiento = new Date(fechaActual);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 14);
      const fechaVencimientoStr = fechaVencimiento.toISOString().split("T")[0];

      const montoLiteral = convertirNumeroAPalabras(montoTotalPago);
      const centavos = (montoTotalPago % 1).toFixed(2).split('.')[1];

      const nuevaOrden = {
        idInscripcion: primeraInscripcion.id_inscripcion,
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
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inputValue,
    setInputValue,
    codigoIntroducido,
    ordenData,
    mostrarDetalle,
    ordenGenerada,
    error,
    isLoading,
    handleSearch,
    handleInputChange,
    handleKeyPress,
    handleGenerarOrden
  };
};

export default useOrdenPago;