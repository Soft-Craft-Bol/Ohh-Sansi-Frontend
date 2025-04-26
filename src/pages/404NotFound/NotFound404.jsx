import { Link } from "react-router";
import "./NotFound404.css";  // Asegúrate de importar el archivo CSS

export const NotFound404 = () => {
  return (
    <div className="notfound-404__container">
      <div className="notfound-404__content">
        <h1 className="notfound-404__title">ERROR</h1>

        <img
          src="src/assets/img/404.svg"
          alt="404"
          className="notfound-404__image notfound-404__image--light"
        />
        <img
          src="/images/error/404-dark.svg"
          alt="404"
          className="notfound-404__image notfound-404__image--dark"
        />

        <p className="notfound-404__message">
          ¡No podemos encontrar la página que buscas!
        </p>

        <Link
          to="/"
          className="notfound-404__link"
        >
          Regresar a la página de inicio
        </Link>
      </div>

      <p className="notfound-404__footer">
        &copy; {new Date().getFullYear()} - SoftCraft SRL
      </p>
    </div>
  );
};
