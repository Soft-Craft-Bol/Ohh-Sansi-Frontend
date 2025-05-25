import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getOrdenPagoDetailInfo, createOrdenPago, getOrdenPagoExcel } from '../../api/api';
import { convertirNumeroAPalabras } from '../../utils/numberUtils';

const useOrdenPago = () => {
  const [inputValue, setInputValue] = useState("");
  const [codigoIntroducido, setCodigoIntroducido] = useState("");
  const [ordenData, setOrdenData] = useState(null);
  const [ordenExel, setOrdenExcel] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [ordenGenerada, setOrdenGenerada] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setCodigoIntroducido(inputValue.trim());
      setInputValue("");
      setError(null);
    } else {
      Swal.fire({
        title: 'Campo vacío',
        text: 'Por favor, introduce un código válido',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") handleSearch();
  };

  useEffect(() => {
    const fetchOrdenData = async () => {
        if (!codigoIntroducido) return;

        setIsLoading(true);
        setError(null);
        try {
            const excelResponse = await getOrdenPagoExcel(codigoIntroducido);
            setOrdenExcel(excelResponse.data);
            setMostrarDetalle(false);
            setOrdenGenerada(null);
            console.log("Datos recibidos de getOrdenPagoExcel:", excelResponse.data);
            return;
        } catch (excelError) {
            // Verificamos si el error es el específico que indica que debemos intentar con getOrdenPagoDetailInfo
            if (excelError.response?.data?.message === "Error al obtener los detalles de inscripcion" &&
                excelError.response?.data?.details === "Incorrect result size: expected 1, actual 0") {
                console.log("Error específico detectado, intentando con getOrdenPagoDetailInfo...");
                try {
                    const detailResponse = await getOrdenPagoDetailInfo(codigoIntroducido);
                    setOrdenData(detailResponse.data);
                    setMostrarDetalle(false);
                    setOrdenGenerada(null);
                    console.log("Datos recibidos de getOrdenPagoDetailInfo:", detailResponse.data);
                } catch (detailError) {
                    // Manejo de error para getOrdenPagoDetailInfo
                    console.error("Error al obtener los datos con getOrdenPagoDetailInfo:", detailError.response?.data || detailError.message);
                    if (!detailError.response) {
                        setError("Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.");
                    } else {
                        setError("No se encontró la inscripción con el código proporcionado"); // Este mensaje podría ser más genérico
                    }
                    setOrdenData(null);
                }
            } else {
                // Manejo de otros errores de getOrdenPagoExcel
                console.error("Error al obtener los datos con getOrdenPagoExcel:", excelError.response?.data || excelError.message);
                if (!excelError.response) {
                    setError("Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.");
                } else {
                    setError("Error al obtener los datos de la inscripción");
                }
                setOrdenData(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    fetchOrdenData();
}, [codigoIntroducido]);

  const handleGenerarOrden = async () => {
    let  id_inscripcion, cantidadAreas, precioPorArea, montoTotalPago,
     fechaEmision,  fechaVencimientoStr,montoLiteral, centavos, nombreResponsable;
    if(ordenExel){
      id_inscripcion = ordenExel.Responsable?.idInscripcion;

      cantidadAreas = ordenExel.Responsable?.cantAreas;
      precioPorArea = ordenExel.olimpiadas[0]?.precio_olimpiada || 0;
      montoTotalPago = cantidadAreas * precioPorArea;

      const fechaActual = new Date();
      fechaEmision = fechaActual.toISOString().split("T")[0];
      const fechaVencimiento = new Date(fechaActual);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 14);
      fechaVencimientoStr = fechaVencimiento.toISOString().split("T")[0];
      nombreResponsable = `${ordenExel.Responsable.nombreTut || ""} ${ordenExel.Responsable.apellidoTut || ""}`.trim();

      montoLiteral = convertirNumeroAPalabras(montoTotalPago);
      centavos = (montoTotalPago % 1).toFixed(2).split('.')[1];
    }else{

      if (!ordenData) return;

      setIsLoading(true);
    
      const primeraInscripcion = ordenData.inscripcion?.[0];
      if (!primeraInscripcion) {
        throw new Error("No se encontró información de inscripción");
      }
      id_inscripcion = primeraInscripcion.id_inscripcion;
      const areas = ordenData.areas || [];
      const primerTutor = ordenData.tutores?.[0] || {};
      nombreResponsable = `${primerTutor.nombres_tutor || ""} ${primerTutor.apellidos_tutor || ""}`.trim();

      cantidadAreas = areas.length;
      precioPorArea = ordenData.olimpiadas[0]?.precio_olimpiada || 0;
      montoTotalPago = cantidadAreas * precioPorArea;

      const fechaActual = new Date();
      fechaEmision = fechaActual.toISOString().split("T")[0];
      const fechaVencimiento = new Date(fechaActual);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 14);
      fechaVencimientoStr = fechaVencimiento.toISOString().split("T")[0];
      montoLiteral = convertirNumeroAPalabras(montoTotalPago);
      centavos = (montoTotalPago % 1).toFixed(2).split('.')[1];
    }
      try {
      const nuevaOrden = {
        idInscripcion: id_inscripcion,
        idMetodoPago: 1,
        idEstado: 1,
        fechaEmisionOrdenPago: fechaEmision,
        fechaVencimiento: fechaVencimientoStr,
        montoTotalPago: montoTotalPago,
        codOrdenPago: `N°${Math.floor(1000000 + Math.random() * 9000000)}`,
        emisor: "FACULTAD CIENCIAS Y TECNOLOGIA",
        precioLiteral: `${montoLiteral} ${centavos}/100`,
        responsablePago: nombreResponsable,
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
      if (!error.response) {
        setError("Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.");
      } else {
        setError(error.response?.data?.message || error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inputValue,
    setInputValue,
    codigoIntroducido,
    ordenData,
    ordenExel,
    mostrarDetalle,
    ordenGenerada,
    error,
    isLoading,
    handleSearch,
    handleKeyPress,
    handleGenerarOrden
  };
};

export default useOrdenPago;