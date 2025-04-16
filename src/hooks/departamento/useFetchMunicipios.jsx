import { useState, useEffect } from "react";
import { getMunicipiosByDepartamento } from "../../api/api";

const municipiosCache = new Map();

const useFetchMunicipios = (idDepartamento) => {
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(!!idDepartamento);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idDepartamento) return;

    if (municipiosCache.has(idDepartamento)) {
      setMunicipios(municipiosCache.get(idDepartamento));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getMunicipiosByDepartamento(idDepartamento);
        const data = response.data?.municipios ?? [];

        if (Array.isArray(data)) {
          municipiosCache.set(idDepartamento, data);
          setMunicipios(data);
        } else {
          setMunicipios([]);
        }
      } catch (err) {
        setError(err);
        setMunicipios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idDepartamento]);

  return { municipios, loading, error };
};

export default useFetchMunicipios;
