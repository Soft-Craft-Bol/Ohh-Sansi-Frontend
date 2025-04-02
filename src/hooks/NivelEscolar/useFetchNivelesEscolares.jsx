import { useState, useEffect } from "react";
import { getNivelEscolar } from "../../api/api";

const useFetchNivelesEscolares = () => {
  const [niveles, setNiveles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNivelEscolar();
        if (response.data && Array.isArray(response.data)) {
          setNiveles(response.data);
        } else {
          setNiveles([]);
        }
      } catch (err) {
        setError(err);
        setNiveles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { niveles, loading, error }; 
};

export default useFetchNivelesEscolares;
