import { useState, useEffect } from "react";
import { getMunicipiosByDepartamento } from "../../api/api";

const useFetchMunicipios = (idDepartamento) => {
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idDepartamento) return; 

    const fetchData = async () => {
      try {
        const response = await getMunicipiosByDepartamento(idDepartamento);
        if (response.data.municipios && Array.isArray(response.data.municipios)) {
          setMunicipios(response.data.municipios);
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
