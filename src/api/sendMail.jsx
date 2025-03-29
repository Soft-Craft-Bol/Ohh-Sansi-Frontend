import { Resend } from "resend";
import InscripcionConfirmacion from "../utils/emails/newsletter";

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export async function sendEmail() {
  try {
    const emailResponse = await resend.emails.send({
      to: "202201511@est.umss.edu",
      from: "Jhoelito <correo@tudominio.com>", // Debe ser un dominio verificado
      subject: "Primera prueba de email",
      react: <InscripcionConfirmacion />,
    });

    console.log("Email enviado:", emailResponse);
    return emailResponse;
  } catch (error) {
    console.error("Error enviando email:", error);
    return error;
  }
}
