import { Resend } from "resend";
import InscripcionConfirmacion from "../utils/emails/newsletter";
import ReactDOMServer from 'react-dom/server';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);
//Transformar el componente a HTML
const emailBody = ReactDOMServer.renderToStaticMarkup(<InscripcionConfirmacion />);

export async function sendEmail() {
  try {
    const emailResponse = await resend.emails.send({
      to: "202201511@est.umss.edu", //static meanwhile
      from: "Informaciones <info@softcraftbol.com>",
      subject: "Primera prueba de email",
      react: emailBody,
    });

    console.log("Email enviado:", emailResponse);
    return emailResponse;
  } catch (error) {
    console.error("Error enviando email:", error);
    return error;
  }
}
