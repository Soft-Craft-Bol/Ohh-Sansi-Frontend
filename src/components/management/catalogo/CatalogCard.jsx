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
    <div className="catalog-card-grid">
      <div className="grid-item area">{area}</div>
      <div className="grid-item category">{categories}</div>
      <div className="grid-item grades">{rangoGrados}</div>
    </div>
  );
};

export default CatalogCard;
