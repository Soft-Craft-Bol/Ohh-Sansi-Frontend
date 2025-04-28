import { useState, useEffect } from "react";
import { getGrados } from "../../api/api";

let gradosCache = null;

const useFetchGrados = () => {
  const [grados, setGrados] = useState([]);
  const [loading, setLoading] = useState(!gradosCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (gradosCache) {
      setGrados(gradosCache);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await getGrados();
        if (response.data && Array.isArray(response.data.data)) {
          gradosCache = response.data.data; 
          setGrados(gradosCache);
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
