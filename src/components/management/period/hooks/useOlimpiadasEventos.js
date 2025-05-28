import { useQuery } from '@tanstack/react-query';
import { getOlimpiadasConEventos } from '../../../../api/api';

export default function useOlimpiadasEventos() {
  const { data = [] } = useQuery({
    queryKey: ['olimpiadas-con-eventos'],
    queryFn: getOlimpiadasConEventos,
    select: res => {
      const raw = res?.data;
      if (!Array.isArray(raw)) return {};
      return raw.reduce((acc, o) => {
        acc[o.idOlimpiada] = o.eventos || [];
        return acc;
      }, {});
    }
  });
  return { data };
}