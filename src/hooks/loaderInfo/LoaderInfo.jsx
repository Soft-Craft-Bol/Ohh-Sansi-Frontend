import Swal from "sweetalert2";
import { getEstudianteByCarnet, verifyEstudiante } from "../../api/api";

export const verificarParticipante = async (ci, onComplete, onError) => {
  if (!ci) return;

  try {

    const res = await getEstudianteByCarnet(ci);

    if (res.data.fechaNacimiento) { //if exists
      const { value: valuePermit } = await Swal.fire({
        title: "Participante encontrado",
        text: "Por favor, ingresa tu correo electrónico para verificar tu identidad y auto completar tu información",
        input: "email",
        inputPlaceholder: "correo@ejemplo.com",
        confirmButtonText: "Verificar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
          if (!value) return "Debes ingresar un correo";
        },
      });

      if (!valuePermit) {
        console.log("Verificación cancelada o correo vacío");
        return;
      }

      const result = await verifyEstudiante({ ci, valuePermit });
      console.log("Resultado de la verificación:", result);

      onComplete?.(result.data);
    } else {
      console.log("CI no encontrado");
      onError?.("No se encontró el participante con el CI proporcionado.");
    }
  } catch (error) {
    console.error("Error en encontrar ci:", error);
    onError?.("No se pudo verificar la información.");
  }
};
