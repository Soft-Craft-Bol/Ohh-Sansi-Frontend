import './CatalogCard.css';
import { formatGrades, ordenarGrados } from '../../../utils/GradesOrder';
import { FaEdit, FaChevronDown, FaChevronUp, FaLock } from 'react-icons/fa';
import { useState } from 'react';

const CatalogCard = ({ items, onEdit, isInscripcion = false }) => {
  const groupedByArea = items.reduce((acc, item) => {
    const area = item.nombreArea;
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(item);
    return acc;
  }, {});

  return (
    <div className="com-catalog-container">
      {Object.entries(groupedByArea).map(([area, areaItems]) => (
        <AreaGroup 
          key={area} 
          area={area} 
          items={areaItems} 
          onEdit={onEdit}
          isInscripcion={isInscripcion}
        />
      ))}
    </div>
  );
};

const AreaGroup = ({ area, items, onEdit, isInscripcion }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="com-area-group">
      <div 
        className="com-area-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="com-area-info">
          <h3 className="com-area-title">{area}</h3>
          <span className="com-area-count">
            {items.length} categoría{items.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button className="com-expand-button">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      <div className={`com-categories-container ${isExpanded ? 'com-expanded' : 'com-collapsed'}`}>
        {items.map((item, index) => (
          <div key={`${item.nombreCategoria}-${index}`} className="com-category-card">
            <div className="com-category-content">
              <div className="com-category-info">
                <h4 className="com-category-name">{item.nombreCategoria}</h4>
                <div className="com-grades-info">
                  <span className="com-grades-label">Grados:</span>
                  <span className="com-grades-value">{formatGrades(item.grados)}</span>
                </div>
              </div>
              
              <button 
                className={`com-edit-button ${isInscripcion ? 'com-disabled' : ''}`}
                onClick={() => !isInscripcion && onEdit(item)}
                disabled={isInscripcion}
                title={isInscripcion ? "No se puede editar durante inscripción" : "Editar categoría"}
              >
                {isInscripcion ? (
                  <>
                    <FaLock className="com-edit-icon" />
                    <span className="com-edit-text">Bloqueado</span>
                  </>
                ) : (
                  <>
                    <FaEdit className="com-edit-icon" />
                    <span className="com-edit-text">Editar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogCard;