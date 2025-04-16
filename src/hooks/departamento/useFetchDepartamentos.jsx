import { useState, useEffect } from "react";
import { getDepartamentos } from "../../api/api";

let cachedDepartamentos = null;

const useFetchDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(!cachedDepartamentos);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedDepartamentos) {
      setDepartamentos(cachedDepartamentos);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await getDepartamentos();
        const data = response.data?.departamentos ?? [];

        if (Array.isArray(data)) {
          cachedDepartamentos = data;
          setDepartamentos(data);
        } else {
          setDepartamentos([]);
        }
      } catch (err) {
        setError(err);
        setDepartamentos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { departamentos, loading, error };
};

export default useFetchDepartamentos;
