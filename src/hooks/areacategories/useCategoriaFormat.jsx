import { useMemo } from 'react';

const useCategoriaFormat = (categories = [], grados = []) => {
  const gradoMap = useMemo(() => {
    return Object.fromEntries(grados.map(g => [g.idGrado, g.nombreGrado]));
  }, [grados]);

  const categoriasFormateadas = useMemo(() => {
    return categories.map(cat => {
      const nombresGrados = (cat.grados || [])
        .map(id => gradoMap[id])
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)); 

      const rango = nombresGrados.length === 0
        ? 'Sin grados'
        : nombresGrados.length === 1
          ? nombresGrados[0]
          : `${nombresGrados[0]} - ${nombresGrados[nombresGrados.length - 1]}`;

      return {
        label: `${cat.nombreCategoria} (${rango})`,
        value: cat.nombreCategoria
      };
    });
  }, [categories, gradoMap]);

  return categoriasFormateadas;
};

export default useCategoriaFormat;
