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
import { ordenarGrados } from '../../../utils/GradesOrder';
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
    modalOpen: false,
    error: null
  });

  const showAlert = (type, title, message) => {
  Swal.fire({
    icon: type,
    title: title,
    html: `<div style="max-height: 200px; overflow-y: auto;">${message}</div>`,
    timer: type === 'error' ? 5000 : 3000,
    showConfirmButton: type === 'error',
    background: 'var(--light)',
    color: 'var(--dark)',
    width: '600px'
  });
};

  const fetchData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const [olimpiadasRes, areasRes, categoriesRes, catalogoRes] = await Promise.all([
        getOlimpiadas(),
        getAreas(),
        getGradosCategorias(),
        getCatalogoOlimpiada(),
      ]);

      const processCatalogoData = (data) => {
        if (!Array.isArray(data)) return [];
        
        return data.map(item => ({
          ...item,
          grados: Array.isArray(item.grados) 
            ? item.grados.map(grado => (typeof grado === 'string' ? { nombreGrado: grado } : grado))
            : []
        }));
      };

      const olimpiadasData = Array.isArray(olimpiadasRes?.data?.data) ? olimpiadasRes.data.data : [];
      const areasData = Array.isArray(areasRes?.data?.areas) ? areasRes.data.areas : [];
      const categoriesData = Array.isArray(categoriesRes?.data) ? categoriesRes.data : [];
      const catalogoData = processCatalogoData(catalogoRes?.data || []);
      const sortedOlimpiadas = [...olimpiadasData].sort((a, b) => b.anio - a.anio);

      setState({
        areas: areasData,
        categories: categoriesData,
        olimpiadas: sortedOlimpiadas,
        catalogo: catalogoData,
        selectedOlimpiada: sortedOlimpiadas[0]?.idOlimpiada || null,
        loading: false,
        modalOpen: false,
        error: null
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      showAlert('error', 'Error', 'No se pudieron cargar los datos');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = async (formData) => {
  try {
    if (!state.selectedOlimpiada) {
      throw new Error('No se ha seleccionado una olimpiada');
    }

    const currentOlimpiada = state.olimpiadas.find(o => o.idOlimpiada === state.selectedOlimpiada);
    
    if (currentOlimpiada.nombreEstado !== 'PLANIFICACION') {
      throw new Error('Solo se puede modificar el catálogo cuando la olimpiada está en estado "PLANIFICACION"');
    }

    const payload = {
      ...formData,
      idOlimpiada: currentOlimpiada.idOlimpiada,
    };

    const response = await saveCatalogoOlimpiada(payload);
    
    if (response?.data?.status === 'success') {
      showAlert('success', 'Éxito', response.data.message || 'Ítem guardado correctamente');
      await fetchData();
    } else {
      throw new Error(response?.data?.message || 'Error al guardar el ítem');
    }
  } catch (error) {
    console.error("Error saving catalog item:", error);
    showAlert(
      'error', 
      'Error', 
      error.response?.data?.message || error.message || 'Error al procesar la solicitud'
    );
  }
};

  const getFilteredCatalogo = () => {
    if (!state.selectedOlimpiada) return [];
    
    const currentOlimpiada = state.olimpiadas.find(o => o.idOlimpiada === state.selectedOlimpiada);
    if (!currentOlimpiada) return [];

    return state.catalogo
      .filter(item => item.nombreOlimpiada === currentOlimpiada.nombreOlimpiada)
      .map(item => ({
        ...item,
        grados: ordenarGrados(item.grados)
      }));
  };

  const filteredCatalogo = getFilteredCatalogo();
  const currentOlimpiada = state.olimpiadas.find(o => 
    o.idOlimpiada === state.selectedOlimpiada
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
                  disabled={!state.selectedOlimpiada}
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