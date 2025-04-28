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
            <div className="card-header">
                <h3 className="area-title">{area}</h3>
                <div className="category-badge">{categories}</div>
            </div>
            <div className="card-content">
                <div className="grades-section">
                    <h4 className="grades-title">Grados:</h4>
                    <div className="grades-list">
                        {gradosOrdenados.map((grado, index) => (
                            <span key={index} className="grade-item">{grado}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CatalogCard;
