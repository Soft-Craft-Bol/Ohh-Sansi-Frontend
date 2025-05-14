import './CatalogCard.css';

const CatalogCard = ({ area, category, grades }) => {
  const formatGrades = () => {
    if (!grades || grades.length === 0) return 'Sin grados especificados';
    
    const sortedGrades = [...grades].sort((a, b) => {
      const getNumber = (grade) => parseInt(grade.match(/\d+/)?.[0] || 0);
      return getNumber(a) - getNumber(b);
    });

    if (sortedGrades.length === 1) return sortedGrades[0];
    
    return `${sortedGrades[0]} - ${sortedGrades[sortedGrades.length - 1]}`;
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