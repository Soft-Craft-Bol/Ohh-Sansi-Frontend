import { useState, useEffect } from "react";
import { getAreaByIdGrade } from "../../api/api";

const getUniqueAreas = (areas = []) => {
  const map = new Map();
  areas.forEach(area => {
    if (!map.has(area.idArea)) {
      map.set(area.idArea, area);
    }
  });
  return Array.from(map.values());
};

const useFetchAreasGrados = (idNivel) => {
  const [areas, setAreas] = useState([]);
  const [areasCategorias, setAreasCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idNivel) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAreaByIdGrade(idNivel);

        const allAreas = response.data?.areas || [];
        const categorias = response.data?.areasCategorias || [];

        setAreas(getUniqueAreas(allAreas));
        setAreasCategorias(categorias);
      } catch (err) {
        console.error("Error fetching areas by grade:", err);
        setError(err);
        setAreas([]);
        setAreasCategorias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idNivel]);

  return { areas, areasCategorias, loading, error };
};

export default useFetchAreasGrados;
