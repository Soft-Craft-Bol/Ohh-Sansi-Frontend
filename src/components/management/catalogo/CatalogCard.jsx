import './CatalogCard.css';
import { GRADO_ORDEN, ordenarGrados } from '../../../utils/GradesOrder';

const CatalogCard = ({ area, categories, grades = '', onDelete }) => {
  const gradosOrdenados = ordenarGrados(
    grades.split(',').map(g => ({ nombreGrado: g.trim() }))
  ).map(g => g.nombreGrado);

  const rangoGrados = gradosOrdenados.length === 0
    ? 'Sin grados'
    : gradosOrdenados.length === 1
      ? gradosOrdenados[0]
      : `${gradosOrdenados[0]} - ${gradosOrdenados[gradosOrdenados.length - 1]}`;

  return (
    <div className="catalog-card">
      <div className="catalog-info">
        <p className="catalog-area">{area}</p>
        <div className="catalog-categories">
          <span>{categories}</span>
        </div>
        <div className="grades-container">
          {gradosOrdenados.map((grado, index) => (
            <span key={index} className="grade-badge">{grado}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogCard;
