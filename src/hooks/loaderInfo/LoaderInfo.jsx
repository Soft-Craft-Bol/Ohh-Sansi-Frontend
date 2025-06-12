import Swal from "sweetalert2";
import { getEstudianteByCarnet, verifyEstudiante, getTutorByCi, verifyTutor } from "../../api/api";

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
        return;
      }

      const result = await verifyEstudiante({ ci, valuePermit });
      onComplete?.(result.data);
    } else {
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
    if (res.data.fechaNacimiento) { //if exists
      const nombre = res.data.nombreParticipante?.split(" ")[0] || "";

      const apellidoPaternoInicial = res.data.apellidoPaterno
        ? res.data.apellidoPaterno[0].toUpperCase() + ".": "";

      const apellidoMaternoInicial = res.data.apellidoMaterno
        ? res.data.apellidoMaterno[0].toUpperCase() + ".": "";

      const apellidoInicial = `${apellidoPaternoInicial} ${apellidoMaternoInicial}`.trim();

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
        Swal.fire({
          icon: "info",
          title: "Verificación cancelada",
          text: "No se completó la verificación como tutor.",
        });
      
        onError?.(); // Notifica al componente para detener el flujo
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

    onError?.();
  }
};

export const verificarTutor = async (ci, onComplete, onError) => {
  if (!ci) return;

  try {
    const res = await getTutorByCi(ci);

    if (res.data.idTutor) { // Verificamos si existe algún tutor retornado
      const { value: valuePermit } = await Swal.fire({
        title: "Tutor encontrado",
        text: "Por favor, ingresa tu correo electrónico para verificar tu identidad y autocompletar tu información",
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
        Swal.fire({
          icon: "info",
          title: "Verificación cancelada",
          text: "No se completó la verificación como tutor.",
        });
        onError?.(); 
        return;
      }

      const result = await verifyTutor({ ci, valuePermit });
      onComplete?.(result.data);
    } else {
      onError?.("No se encontró un tutor con el CI proporcionado.");
    }
  } catch (error) {
    console.error("Error al encontrar tutor por CI:", error);
    onError?.("No se pudo verificar la información del tutor.");
  }
};