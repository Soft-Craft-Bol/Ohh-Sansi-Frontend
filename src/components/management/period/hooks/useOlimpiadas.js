import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { getOlimpiadas } from '../../../../api/api';

export default function useOlimpiadas() {
  return useQuery({
    queryKey: ['olimpiadas'],
    queryFn: getOlimpiadas,
    select: res => {
      const arr = res?.data?.data;
      return Array.isArray(arr)
        ? arr.map(o => ({
            idOlimpiada: o.idOlimpiada,
            nombreOlimpiada: o.nombreOlimpiada,
            anio: o.anio,
            estado: o.nombreEstado,
          }))
        : [];
    },
    onError: error => Swal.fire('Error', error.message, 'error')
  });
}