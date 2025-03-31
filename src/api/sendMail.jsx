import { Resend } from "resend";
import InscripcionConfirmacion from "../utils/emails/newsletter";
import ReactDOMServer from 'react-dom/server';

export async function sendEmail() {
  try {
    const emailBody = ReactDOMServer.renderToStaticMarkup(<InscripcionConfirmacion />);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      mode: 'no-cors', // Desactiva CORS
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        to: "202201511@est.umss.edu",
        from: "Informaciones <info@softcraftbol.com>",
        subject: "Primera prueba de email",
        html: emailBody, // Aquí usamos "html" en vez de "react"
      }),
    });

    console.log("Respuesta enviada, pero no accesible:", response);
    return response; // Respuesta opaca; no contiene contenido útil
  } catch (error) {
    console.error("Error enviando email:", error);
    return error;
  }
}

