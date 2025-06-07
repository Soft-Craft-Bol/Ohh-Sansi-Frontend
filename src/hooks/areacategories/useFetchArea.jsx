import { useEffect, useState } from "react";
import { getAreas } from "../../api/api";

const useFetchArea = () => {
  const [areas, setAreas] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAreas();
        if (response.data && Array.isArray(response.data.data)) {
          setAreas(response.data.data);
        } else {
          setAreas([]);
        }
      } catch (err) {
        setError(err);
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return { areas, loading, error }; 
};

export default useFetchArea;
