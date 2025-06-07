import { useQuery } from '@tanstack/react-query';
import { getOlimpiadasConEventos } from '../../../../api/api';

export default function useOlimpiadasEventos() {
  return useQuery({
    queryKey: ['olimpiadas-con-eventos'],
    queryFn: getOlimpiadasConEventos,
    select: res => {
      const raw = res?.data;
      if (!Array.isArray(raw)) return {};
      
      const eventosData = raw.reduce((acc, o) => {
        acc[o.idOlimpiada] = o.eventos || [];
        return acc;
      }, {});
      
      console.log('Datos de eventos procesados:', eventosData); 
      return eventosData;
    }
  });
}