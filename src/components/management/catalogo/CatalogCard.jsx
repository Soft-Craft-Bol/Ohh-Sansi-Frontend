// components/CatalogCard.jsx
import './CatalogCard.css';

const CatalogCard = ({ area, categories, grades = [], onDelete }) => {
  return (
    <div className="catalog-card">
      <div className="catalog-info">
        <p className="catalog-area">{area}</p>
        <p className="catalog-categories">
          Categorías: {categories}
          <p className='catalog-grades'>Grados: {grades}</p>
        </p>
      </div>
      {/* <button className="delete-button" onClick={onDelete}>🗑️</button> */}
    </div>
  );
};

export default CatalogCard;
