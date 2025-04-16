import { useState, useEffect } from "react";
import { getColegiosByMunicipio } from "../../api/api";

const colegiosCache = new Map();

const useFetchColegio = (idMunicipio) => {
  const [colegios, setColegios] = useState([]);
  const [loading, setLoading] = useState(!!idMunicipio);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idMunicipio) return;

    if (colegiosCache.has(idMunicipio)) {
      setColegios(colegiosCache.get(idMunicipio));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getColegiosByMunicipio(idMunicipio);
        const data = response.data?.colegios ?? [];

        if (Array.isArray(data)) {
          colegiosCache.set(idMunicipio, data);
          setColegios(data);
        } else {
          setColegios([]);
        }
      } catch (err) {
        setError(err);
        setColegios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idMunicipio]);

  return { colegios, loading, error };
};

export default useFetchColegio;
