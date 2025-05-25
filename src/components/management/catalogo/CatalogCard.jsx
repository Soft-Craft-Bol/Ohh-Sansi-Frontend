import './CatalogCard.css';
import { ordenarGrados } from '../../../utils/GradesOrder';
import { FaEdit } from 'react-icons/fa';

const CatalogCard = ({ item, onEdit }) => {
  const { nombreArea: area, nombreCategoria: category, grados: grades } = item;

  const formatGrades = () => {
    if (!grades || grades.length === 0) return 'Sin grados especificados';

    const normalizedGrades = grades.map(grade =>
      typeof grade === 'string' ? { nombreGrado: grade } : grade
    );

    const sortedGrades = ordenarGrados(normalizedGrades);

    const gradeNames = sortedGrades.map(g => g.nombreGrado || g);

    if (gradeNames.length === 1) return gradeNames[0];

    return `${gradeNames[0]} - ${gradeNames[gradeNames.length - 1]}`;
  };

  return (
    <div className="catalog-card">
      <div className="card-badge">{area}</div>
      <div className="card-content">
        <div className="card-header">
          <h3>{category}</h3>
          <button
            className="edit-button"
            onClick={() => onEdit(item)}
          >
            <FaEdit className="edit-icon" />
          </button>
        </div>
        <div className="grades-info">
          <span>Grados:</span>
          <strong>{formatGrades()}</strong>
        </div>
      </div>
    </div>
  );
};

export default CatalogCard;