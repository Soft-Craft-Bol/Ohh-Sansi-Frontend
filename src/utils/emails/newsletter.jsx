import React from "react";
import { Body, Button, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components";

export default function InscripcionConfirmacion() {
  return (
    <Html>
      <Head />
      <Preview>Confirmación de inscripción - Ohh-Sansi</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={title}>Inscripción enviada</Text>
            <Text style={paragraph}>
              Se ha procesado su solicitud para la inscripción en el evento Ohh-Sansi.
            </Text>
            <Button style={button} href="#">
              Descargar orden de pago
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>
              Se publicará más información pronto. Mientras tanto, si tienes alguna pregunta, no dudes en comunicarte con nosotros a través de nuestras redes:
            </Text>
            <Text style={contactInfo}>
              <Img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" style={icon} /> +591 71486093
            </Text>
            <Text style={contactInfo}>
              <Img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" style={icon} /> softcraft2024@gmail.com
            </Text>
            <Text style={paragraph}>¡Te esperamos!</Text>
            <Text style={paragraph}>
              El equipo de <Link href="https://www.softcraftbol.com/">Softcraft</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f1f5f9",
  fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "600px",
  textAlign: "left",
};

const box = {
  padding: "0 20px",
};

const title = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const paragraph = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 24px",
  margin: "20px 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const contactInfo = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "16px",
};

const icon = {
  width: "20px",
  height: "20px",
};
