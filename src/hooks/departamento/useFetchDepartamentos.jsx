import { useState, useEffect } from "react";
import { getDepartamentos } from "../../api/api";

const useFetchDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDepartamentos();
        if (response.data.departamentos && Array.isArray(response.data.departamentos)) {
          setDepartamentos(response.data.departamentos);
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
