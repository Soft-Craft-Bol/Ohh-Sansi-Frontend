import React from 'react';
import './MainContent.css';

const MainContent = () => {
  return (
    <main>
      <div className="head-title">
        <div className="left">
          <h1>Tablero </h1>
          <ul className="breadcrumb">
            <li>
              <a href="#">Tablero de Escritorio</a>
            </li>
            <li><i className='bx bx-chevron-right'></i></li>
            <li>
              <a className="active" href="#">Pagina principal</a>
            </li>
          </ul>
        </div>
        <a href="#" className="btn-download">
          <i className='bx bxs-cloud-download'></i>
          <span className="text">Descargar PDF</span>
        </a>
      </div>

      <ul className="box-info">
        <li>
          <i className='bx bxs-calendar-check'></i>
          <span className="text">
            <h3>1020</h3>
            <p>Nueva Orden</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-group'></i>
          <span className="text">
            <h3>2834</h3>
            <p>Visitantes</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-dollar-circle'></i>
          <span className="text">
            <h3>$2543</h3>
            <p>Total Ventas</p>
          </span>
        </li>
      </ul>

      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>Recientes</h3>
            <i className='bx bx-search'></i>
            <i className='bx bx-filter'></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Fecha de orden</th>
                <th>Estados</th>
              </tr>
            </thead>
            <tbody>
              {/* Aquí puedes mapear los datos de las órdenes */}
            </tbody>
          </table>
        </div>
        <div className="todo">
          <div className="head">
            <h3>Todos</h3>
            <i className='bx bx-plus'></i>
            <i className='bx bx-filter'></i>
          </div>
          <ul className="todo-list">
            {/* Aquí puedes mapear los todos */}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default MainContent;