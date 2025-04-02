import React from "react";
import {ButtonPrimary} from "../button/ButtonPrimary";
import "./CategoryCard.css";

const CategoryCard = ({ category, onDelete }) => {
  return (
    <div className="category-card">
      <div>
        <strong>{category.name}</strong>
        <p>{category.description}</p>
        <p><i>{category.grade}</i></p>
      </div>
      <div>
        {category.active && <span className="active-badge">Activo</span>}
        <ButtonPrimary className="icon-btn" onClick={() => onDelete(category.id)}>
          🗑️
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default CategoryCard;
