import { useState, useEffect } from 'react';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import CatalogCard from './CatalogCard';
import CatalogModal from './CatalogModal';
import {
  getAreas,
  getCatalogoOlimpiada,
  getGradosCategorias,
  getOlimpiadas,
  saveCatalogoOlimpiada
} from '../../../api/api';
import './CatalogoManagement.css';
import Swal from 'sweetalert2';

const CatalogoManagement = () => {
  const [state, setState] = useState({
    areas: [],
    categories: [],
    olimpiadas: [],
    catalogo: [],
    selectedOlimpiada: null,
    loading: true,
    modalOpen: false
  });

  const showToast = (type, message) => {
    Swal.fire({
      icon: type,
      title: type === 'error' ? 'Error' : 'Éxito',
      text: message,
      timer: 3000
    });
  };

  const fetchData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const [olimpiadasRes, areasRes, categoriesRes, catalogoRes] = await Promise.all([
        getOlimpiadas(),
        getAreas(),
        getGradosCategorias(),
        getCatalogoOlimpiada(),
      ]);

      const olimpiadasData = Array.isArray(olimpiadasRes.data?.data) ? olimpiadasRes.data.data : [];
      const areasData = Array.isArray(areasRes.data?.areas) ? areasRes.data.areas : [];
      const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
      const catalogoData = Array.isArray(catalogoRes.data) ? catalogoRes.data : [];

      console.log("Datos recibidos:", {
        olimpiadas: olimpiadasData,
        areas: areasData,
        categories: categoriesData,
        catalogo: catalogoData
      });

      // Selecciona la primera olimpiada por defecto
      const defaultOlimpiada = olimpiadasData[0] || null;

      setState({
        areas: areasData,
        categories: categoriesData,
        olimpiadas: olimpiadasData,
        catalogo: catalogoData,
        selectedOlimpiada: defaultOlimpiada ? defaultOlimpiada.idOlimpiada : null,
        loading: false,
        modalOpen: false
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      setState(prev => ({ ...prev, loading: false }));
      showToast('error', 'Error al cargar los datos');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = async (formData) => {
    try {
      const payload = {
        ...formData,
        idOlimpiada: state.selectedOlimpiada
      };

      const response = await saveCatalogoOlimpiada(payload);
      
      if (response?.data?.status === 'success') {
        showToast('success', response.data.message);
        await fetchData();
      } else {
        throw new Error(response?.data?.message || 'Error al guardar');
      }
    } catch (error) {
      console.error("Error saving catalog item:", error);
      showToast('error', error.message);
    }
  };

  // Obtener la olimpiada seleccionada actual
  const currentOlimpiada = state.olimpiadas.find(o => 
    o.idOlimpiada === state.selectedOlimpiada
  );

  // Filtrar catálogo por nombre de olimpiada (ya que los datos muestran nombreOlimpiada)
  const filteredCatalogo = state.catalogo.filter(item => 
    item.nombreOlimpiada && currentOlimpiada?.nombreOlimpiada &&
    item.nombreOlimpiada === currentOlimpiada.nombreOlimpiada
  );

  return (
    <div className="catalogo-app">
      <header className="app-header">
        <h1>Configuración del Catálogo</h1>
        <p>Administra las áreas y categorías para cada olimpiada</p>
      </header>

      <div className="control-panel">
        <div className="olimpiada-selector">
          <label>Olimpiada:</label>
          <div className="selector-buttons">
            {state.olimpiadas.map(olimpiada => (
              <button
                key={olimpiada.idOlimpiada}
                className={`selector-btn ${state.selectedOlimpiada === olimpiada.idOlimpiada ? 'active' : ''}`}
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  selectedOlimpiada: olimpiada.idOlimpiada 
                }))}
              >
                {olimpiada.nombreOlimpiada}
                {olimpiada.estadoOlimpiada && <span className="active-indicator" />}
              </button>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="refresh-btn"
            onClick={fetchData}
            disabled={state.loading}
          >
            <FiRefreshCw className={state.loading ? 'spinning' : ''} />
          </button>
          <button 
            className="add-btn"
            onClick={() => setState(prev => ({ ...prev, modalOpen: true }))}
            disabled={!state.selectedOlimpiada || state.loading}
          >
            <FiPlus /> Nuevo Item
          </button>
        </div>
      </div>

      <main className="catalogo-content">
        {state.loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando configuración...</p>
          </div>
        ) : (
          <>
            <div className="catalogo-info">
              <h2>
                {currentOlimpiada?.nombreOlimpiada || 'Selecciona una olimpiada'}
                {filteredCatalogo.length > 0 && (
                  <span className="items-count">{filteredCatalogo.length} items</span>
                )}
              </h2>
            </div>

            {filteredCatalogo.length === 0 ? (
              <div className="empty-state">
                <p>
                  {state.selectedOlimpiada 
                    ? `No se encontraron configuraciones para ${currentOlimpiada?.nombreOlimpiada || 'esta olimpiada'}`
                    : 'Selecciona una olimpiada para ver sus configuraciones'}
                </p>
                <button 
                  className="primary-btn"
                  onClick={() => setState(prev => ({ ...prev, modalOpen: true }))}
                >
                  <FiPlus /> Crear primera configuración
                </button>
              </div>
            ) : (
              <div className="catalogo-grid">
                {filteredCatalogo.map((item, index) => (
                  <CatalogCard
                    key={`${item.nombreArea}-${item.nombreCategoria}-${index}`}
                    area={item.nombreArea}
                    category={item.nombreCategoria}
                    grades={item.grados}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {state.modalOpen && (
        <CatalogModal
          areas={state.areas}
          categories={state.categories}
          onClose={() => setState(prev => ({ ...prev, modalOpen: false }))}
          onSubmit={handleAddItem}
        />
      )}
    </div>
  );
};

export default CatalogoManagement;