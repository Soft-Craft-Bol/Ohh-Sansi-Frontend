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

export const verificarSerTutor = async (ci, onSuccess, onError) => {
  if (!ci) return;

  try {
    const res = await getEstudianteByCarnet(ci);

    if (res.data?.nombres && res.data?.apellidos) {
      const nombre = res.data.nombres.split(" ")[0];
      const apellidos = res.data.apellidos.split(" ");
      const apellidoInicial = apellidos.length > 0 ? apellidos[0][0] + "." : "";

      const { value: emailConfirm } = await Swal.fire({
        title: `¿Conoces a ${nombre} ${apellidoInicial}?`,
        text: "Si es así, ingresa su correo para continuar como tutor",
        input: "email",
        inputPlaceholder: "correo@ejemplo.com",
        confirmButtonText: "Confirmar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
          if (!value) return "Debes ingresar un correo válido.";
        },
      });

      if (!emailConfirm) {
        return;
      }

      const result = await verifyEstudiante({ ci, valuePermit: emailConfirm });

      if (result.data) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });

        Toast.fire({
          icon: "success",
          title: "Verificación exitosa"
        });

        onSuccess?.(result.data); // Devuelve los datos al componente
      }

    } else {
      throw new Error("Participante no encontrado");
    }
  } catch (error) {
    console.error("Error verificando como tutor:", error);

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: "error",
      title: "No se pudo verificar el CI"
    });

    onError?.(); // Por ejemplo para limpiar el campo
  }
};