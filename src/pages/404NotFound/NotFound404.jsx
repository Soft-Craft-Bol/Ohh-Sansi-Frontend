import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./NotFound404.css";

export const NotFound404 = () => {
  useEffect(() => {
    // Crear estrellas siempre, pero con diferente estilo según el modo
    const createStar = () => {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      document.querySelector(".notfound-404__stars").appendChild(star);
    };

    // Crear 50 estrellas
    for (let i = 0; i < 50; i++) {
      createStar();
    }

    return () => {
      // Limpiar estrellas al desmontar
      document.querySelectorAll(".star").forEach(star => star.remove());
    };
  }, []);

  return (
    <div className="notfound-404__container">
      <div className="notfound-404__stars"></div>
      <div className="notfound-404__content">
        <h1 className="notfound-404__title">
          <span className="notfound-404__title-digit">4</span>
          <span className="notfound-404__title-digit">0</span>
          <span className="notfound-404__title-digit">4</span>
        </h1>

        <div className="notfound-404__image-container">
          <img
            src="/src/assets/img/404.svg"
            alt="404 illustration"
            className="notfound-404__image notfound-404__image--light"
          />
          <img
            src="/images/error/404-dark.svg"
            alt="404 illustration"
            className="notfound-404__image notfound-404__image--dark"
          />
        </div>

        <p className="notfound-404__message">
          ¡Ups! La página que buscas se ha perdido en el espacio
        </p>

        <Link
          to="/"
          className="notfound-404__link"
        >
          <span className="notfound-404__link-text">Regresar a la página de inicio</span>
          <span className="notfound-404__link-icon">→</span>
        </Link>
      </div>

      <p className="notfound-404__footer">
        &copy; {new Date().getFullYear()} - SoftCraft SRL
      </p>
    </div>
  );
};