import './CatalogCard.css';
import { ordenarGrados } from '../../../utils/GradesOrder'; 

const CatalogCard = ({ area, category, grades }) => {
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
        <h3>{category}</h3>
        <div className="grades-info">
          <span>Grados:</span>
          <strong>{formatGrades()}</strong>
        </div>
      </div>
    </div>
  );
};

export default CatalogCard;