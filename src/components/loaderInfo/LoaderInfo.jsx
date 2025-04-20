import { useEffect, useState } from "react";
import { getEstudianteByCarnet, verifyEstudiante } from "../../api/api";

const LoaderInfo = ({ permit, ci, valuePermit, onDataComplete }) => {
  const [exists, setExists] = useState(false);
  const [status, setStatus] = useState("idle"); // 'idle', 'checking', 'verifying', 'done', 'error'

  useEffect(() => {
    if (permit && ci) {
      const fetchData = async () => {
        setStatus("checking");
        try {
          const res = await getEstudianteByCarnet(ci);
          setExists(res.data.exists);
          setStatus(res.data.exists ? "awaiting-permit" : "idle");
        } catch (error) {
          setStatus("error");
        }
      };
  
      fetchData();
    }
  }, [ci, permit]);
  

  useEffect(() => {
    const verificar = async () => {
      if (status === "awaiting-permit" && valuePermit && ci) {
        setStatus("verifying");
        try {
          const res = await verifyEstudiante({ ci, valuePermit });
          setStatus("done");
          onDataComplete(res.data);
        } catch (err) {
          setStatus("error");
        }
      }
    };
  
    verificar();
  }, [valuePermit, status, ci]);
  

  return (
    <div>
      {status === "checking" && <p>Buscando datos...</p>}
      {status === "awaiting-permit" && <p>Datos encontrados. Esperando permiso.</p>}
      {status === "verifying" && <p>Verificando permiso...</p>}
      {status === "done" && <p>Datos completados exitosamente ✅</p>}
      {status === "error" && <p>Error al obtener los datos ❌</p>}
    </div>
  );
};

export default LoaderInfo;
