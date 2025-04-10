export const GRADO_ORDEN = [
    "1ro Primaria",
    "2do Primaria",
    "3ro Primaria",
    "4to Primaria",
    "5to Primaria",
    "6to Primaria",
    "1ro Secundaria",
    "2do Secundaria",
    "3ro Secundaria",
    "4to Secundaria",
    "5to Secundaria",
    "6to Secundaria",
  ];
  
  export const ordenarGrados = (grados) => {
    return [...grados].sort((a, b) => {
      return GRADO_ORDEN.indexOf(a.nombreNivelEscolar) - GRADO_ORDEN.indexOf(b.nombreNivelEscolar);
    });
  };
  