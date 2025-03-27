import { useState, useEffect } from "react";
import { getColegiosByMunicipio } from "../../api/api";

const useFetchColegio = (idMunicipio) => {
  const [colegios, setColegios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idMunicipio) return; 

    const fetchData = async () => {
      try {
        const response = await getColegiosByMunicipio(idMunicipio);
        if (response.data.colegios && Array.isArray(response.data.colegios)) {
          setColegios(response.data.colegios);
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
