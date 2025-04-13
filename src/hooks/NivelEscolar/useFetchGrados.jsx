import { useState, useEffect } from "react";
import { getGrados } from "../../api/api";

const useFetchGrados = () => {
  const [grados, setGrados] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGrados();
        if (response.data && Array.isArray(response.data)) {
          setGrados(response.data);
        } else {
          setGrados([]);
        }
      } catch (err) {
        setError(err);
        setGrados([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { grados, loading, error }; 
};

export default useFetchGrados;
