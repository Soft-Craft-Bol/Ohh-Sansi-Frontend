import { useMemo } from 'react';
import { GRADO_ORDEN, ordenarGrados } from '../../utils/GradesOrder';

const useCategoriaFormat = (categories = [], grados = []) => {
  const gradoMap = useMemo(() => {
    return Object.fromEntries(grados.map(g => [g.idGrado, g.nombreGrado]));
  }, [grados]);

  const categoriasFormateadas = useMemo(() => {
    return categories.map(cat => {
      const nombresGrados = (cat.grados || [])
        .map(id => gradoMap[id])
        .filter(Boolean);

      const nombresGradosOrdenados = ordenarGrados(
        nombresGrados.map(nombre => ({ nombreGrado: nombre }))
      ).map(g => g.nombreGrado);

      const rango = nombresGradosOrdenados.length === 0
        ? 'Sin grados'
        : nombresGradosOrdenados.length === 1
          ? nombresGradosOrdenados[0]
          : `${nombresGradosOrdenados[0]} - ${nombresGradosOrdenados[nombresGradosOrdenados.length - 1]}`;

      return {
        label: `${cat.nombreCategoria} (${rango})`,
        value: cat.idCategoria
      };
    });
  }, [categories, gradoMap]);

  return categoriasFormateadas;
};

export default useCategoriaFormat;