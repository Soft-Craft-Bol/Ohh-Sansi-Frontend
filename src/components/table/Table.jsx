import React, { useState, useMemo } from 'react';
import './Table.css';

const Table = ({ columns, data, onRowClick, rowsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPageSelection, setRowsPerPageSelection] = useState(rowsPerPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Estado para el orden

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPageSelection;
    return data.slice(startIndex, startIndex + rowsPerPageSelection);
  }, [data, currentPage, rowsPerPageSelection]);

  const totalPages = useMemo(() => Math.ceil(data.length / rowsPerPageSelection), [data, rowsPerPageSelection]);

  const hasSubColumns = columns.some(column => column.columns);
  
  const checkRowForEmptyFields = (row) => {
    return columns.some(column => !row[column.accessor]);
  };  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        const aIsNumber = !isNaN(aValue);
        const bIsNumber = !isNaN(bValue);

        if (aIsNumber && bIsNumber) {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
          if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPageSelection(Number(event.target.value));
    setCurrentPage(1); 
  };

  return (
    <div className="table-container">
      <table className="reusable-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                colSpan={column.columns ? column.columns.length : 1}
                onClick={() => handleSort(column.accessor)}
              >
                {column.header}
                {sortConfig.key === column.accessor && (
                  <span>
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
          {hasSubColumns && (
            <tr>
              {columns.map((column, index) =>
                column.columns ? (
                  column.columns.map((subColumn, subIndex) => (
                    <th key={`${index}-${subIndex}`}>{subColumn.header}</th>
                  ))
                ) : (
                  <th key={index}>{column.header}</th>
                )
              )}
            </tr>
          )}
        </thead>
        <tbody>
        {paginatedData.map((row, rowIndex) => {
          const isRowIncomplete = checkRowForEmptyFields(row); // Verificamos si la fila tiene campos vacíos

          return (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              style={isRowIncomplete ? { color: 'white' } : {}}
            >
              {columns.map((column, colIndex) => {
                const value = row[column.accessor] || 'No corresponde';
                const isAreaColumn = column.accessor === 'Area';
                
                return (
                  <td
                    key={colIndex}
                    style={{
                      color: isRowIncomplete ? 'var(--red)' : 'black',
                    }}
                  >
                  {isAreaColumn ? (
                      <span className={isRowIncomplete ? "tips-label-error" : 'tips-label'}>{column.render ? column.render(row) : value}</span>
                    ) : (
                      column.render ? column.render(row) : value
                    )}                  
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>


      </table>

      {/* Paginación */}
      <div className="pagination-container">
        <div className="rows-per-page">
          <label htmlFor="rows-per-page">Filas por página:</label>
          <select
            id="rows-per-page"
            value={rowsPerPageSelection}
            onChange={handleRowsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo; Anterior
          </button>
          <span className="pagination-info">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
