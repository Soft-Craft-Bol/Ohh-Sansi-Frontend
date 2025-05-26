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
      return GRADO_ORDEN.indexOf(a.nombreGrado) - GRADO_ORDEN.indexOf(b.nombreGrado);
    });
  };
  
  export const formatGrados = (grados) => {
  if (!grados || grados.length === 0) return "";
  
  // Separar en Primaria y Secundaria
  const primaria = grados.filter(g => g.includes("Primaria")).sort();
  const secundaria = grados.filter(g => g.includes("Secundaria")).sort();
  
  let result = [];
  
  // Formatear Primaria si existe
  if (primaria.length > 0) {
    const firstPrimaria = primaria[0].split(" ")[0];
    const lastPrimaria = primaria[primaria.length - 1].split(" ")[0];
    result.push(`${firstPrimaria} a ${lastPrimaria} Primaria`);
  }
  
  // Formatear Secundaria si existe
  if (secundaria.length > 0) {
    const firstSecundaria = secundaria[0].split(" ")[0];
    const lastSecundaria = secundaria[secundaria.length - 1].split(" ")[0];
    result.push(`${firstSecundaria} a ${lastSecundaria} Secundaria`);
  }
  
  return result.join(" y ");
};