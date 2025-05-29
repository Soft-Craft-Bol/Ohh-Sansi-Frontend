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
    "6to Secundaria"
];


export const normalizarGrado = (grado) => {
    if (!grado) return '';
    
    if (typeof grado === 'object' && grado.nombreGrado) {
        return grado.nombreGrado;
    }
    
    const gradoStr = String(grado);
    
    if (GRADO_ORDEN.includes(gradoStr)) {
        return gradoStr;
    }
    
    if (/^\d+$/.test(gradoStr)) {
        const num = parseInt(gradoStr);
        if (num <= 6) return `${num}${num === 1 ? 'ro' : 'do'} Primaria`;
        return `${num-6}${num-6 === 1 ? 'ro' : 'do'} Secundaria`;
    }
    
    return gradoStr; 
};

// Ordena los grados según GRADO_ORDEN
export const ordenarGrados = (grados) => {
    if (!grados || !Array.isArray(grados)) return [];
    
    return [...grados]
    .map(g => normalizarGrado(g))
    .filter(g => GRADO_ORDEN. includes(g))
    .sort((a, b) => GRADO_ORDEN.indexOf(a) - GRADO_ORDEN.indexOf(b));
};

// Función para formatear los grados en el formato deseado
export const formatGrados = (grados) => {
    const gradosOrdenados = ordenarGrados(grados);
    if (gradosOrdenados.length === 0) return "";
    
    const grupos = {};
    
    gradosOrdenados.forEach(grado => {
        const [numero, nivel] = grado.split(' ');
        if (!grupos[nivel]) {
            grupos[nivel] = [];
        }
        grupos[nivel].push(numero);
    });
    
    // Formatear cada grupo
    const resultados = [];
    
    for (const [nivel, numeros] of Object.entries(grupos)) {
        if (numeros.length > 1) {
            resultados.push(`${numeros[0]} a ${numeros[numeros.length - 1]} ${nivel}`);
        } else {
            resultados.push(`${numeros[0]} ${nivel}`);
        }
    }
    
    return resultados.join(" y ");
};

// Alias para mantener compatibilidad
export const formatGradosParaSelect = formatGrados;


export const formatGrades = (grades) => {
    if (!grades || grades.length === 0) return 'Sin grados';

    const normalizedGrades = grades.map(grade =>
      typeof grade === 'string' ? { nombreGrado: grade } : grade
    );

    const sortedGrades = ordenarGrados(normalizedGrades);
    const gradeNames = sortedGrades.map(g => g.nombreGrado || g);

    if (gradeNames.length === 1) return gradeNames[0];
    if (gradeNames.length === 2) return gradeNames.join(' - ');
    return `${gradeNames[0]} - ${gradeNames[gradeNames.length - 1]}`;
  };