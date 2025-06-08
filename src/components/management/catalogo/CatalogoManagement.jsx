import { useState, useEffect } from 'react';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import CatalogCard from './CatalogCard';
import CatalogModal from './CatalogModal';
import {
  getAreas,
  getCatalogoOlimpiada,
  getGradosCategorias,
  getGrados,
  getOlimpiadas,
  saveCatalogoOlimpiada
} from '../../../api/api';
import { ordenarGrados } from '../../../utils/GradesOrder';
import './CatalogoManagement.css';
import Swal from 'sweetalert2';
import { FaEdit, FaLock } from 'react-icons/fa';

const CatalogoManagement = () => {
  const [state, setState] = useState({
    areas: [],
    categories: [],
    olimpiadas: [],
    catalogo: [],
    grados: [], 
    selectedOlimpiada: null,
    loading: true,
    modalOpen: false,
    error: null,
    isEditing: false,
    itemToEdit: null,
  });

  const mapGradosIdsToNames = (gradosIds, gradosData) => {
    if (!Array.isArray(gradosIds) || !Array.isArray(gradosData)) return [];
    
    return gradosIds.map(gradoId => {
      const grado = gradosData.find(g => g.idGrado === gradoId);
      return grado ? { 
        idGrado: grado.idGrado,
        nombreGrado: grado.nombreGrado 
      } : null;
    }).filter(Boolean);
  };

  const processCategoriesWithGrades = (categories, grados) => {
    if (!Array.isArray(categories)) return [];

    return categories.map(category => ({
      ...category,
      grados: mapGradosIdsToNames(category.grados, grados)
    }));
  };

  const fetchData = async (preserveSelection = false) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const currentSelectedOlimpiada = preserveSelection ? state.selectedOlimpiada : null;

      const [olimpiadasRes, areasRes, categoriesRes, catalogoRes, gradosRes] = await Promise.all([
        getOlimpiadas(),
        getAreas(),
        getGradosCategorias(),
        getCatalogoOlimpiada(),
        getGrados()
      ]);

      const processCatalogoData = (data, gradosData) => {
        if (!Array.isArray(data)) return [];

        return data.map(item => ({
          ...item,
          grados: Array.isArray(item.grados)
            ? item.grados.map(grado => {
                if (typeof grado === 'object' && grado.nombreGrado) {
                  return grado;
                }
                if (typeof grado === 'number') {
                  const gradoEncontrado = gradosData.find(g => g.idGrado === grado);
                  return gradoEncontrado ? {
                    idGrado: gradoEncontrado.idGrado,
                    nombreGrado: gradoEncontrado.nombreGrado
                  } : null;
                }
                if (typeof grado === 'string') {
                  return { nombreGrado: grado };
                }
                return null;
              }).filter(Boolean)
            : []
        }));
      };

      const olimpiadasData = Array.isArray(olimpiadasRes?.data?.data) ? olimpiadasRes.data.data : [];
      const areasData = Array.isArray(areasRes?.data?.areas) ? areasRes.data.areas : [];
      const rawCategoriesData = Array.isArray(categoriesRes?.data) ? categoriesRes.data : [];
      const gradosData = Array.isArray(gradosRes?.data?.data) ? gradosRes.data.data : [];
      
      const categoriesData = processCategoriesWithGrades(rawCategoriesData, gradosData);
      const catalogoData = processCatalogoData(catalogoRes?.data || [], gradosData);
      const sortedOlimpiadas = [...olimpiadasData].sort((a, b) => b.anio - a.anio);

      const selectedOlimpiada = currentSelectedOlimpiada &&
        sortedOlimpiadas.find(o => o.idOlimpiada === currentSelectedOlimpiada)
        ? currentSelectedOlimpiada
        : sortedOlimpiadas[0]?.idOlimpiada || null;

      setState({
        areas: areasData,
        categories: categoriesData,
        olimpiadas: sortedOlimpiadas,
        catalogo: catalogoData,
        grados: gradosData,
        selectedOlimpiada: selectedOlimpiada,
        loading: false,
        modalOpen: false,
        error: null,
        isEditing: false,
        itemToEdit: null,
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      Swal.fire('error', 'Error', 'No se pudieron cargar los datos');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    if (!state.selectedOlimpiada) {
      throw new Error('No se ha seleccionado una olimpiada');
    }
    const currentOlimpiada = state.olimpiadas.find(o => o.idOlimpiada === state.selectedOlimpiada);

    if (currentOlimpiada.nombreEstado == 'EN INSCRIPCION') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede editar el catálogo cuando la olimpiada está en estado "EN INSCRIPCION"'
      });
    } else {
      setState(prev => ({
        ...prev,
        modalOpen: true,
        isEditing: true,
        itemToEdit: item,
      }));
    }
  };

  const closeModal = () => {
    setState(prev => ({
      ...prev,
      modalOpen: false,
      isEditing: false,
      itemToEdit: null,
    }));
  };

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

      if (state.isEditing && state.itemToEdit?.idCatalogo) {
        payload.idCatalogo = state.itemToEdit.idCatalogo;
      }

      const response = await saveCatalogoOlimpiada(payload);

      if (response?.data?.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: response.data.message || (state.isEditing ? 'Ítem actualizado correctamente' : 'Ítem creado correctamente')
        });
        await fetchData(true); 
        closeModal();
      } else {
        throw new Error(response?.data?.message || 'Error al guardar el ítem');
      }
    } catch (error) {
      console.error("Error saving catalog item:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || error.message || 'Error al procesar la solicitud'
      });
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
          <label>Seleccionar Olimpiada:</label>
          <div className="selector-buttons">
            {state.olimpiadas.map((olimpiada) => (
              <button
                key={olimpiada.idOlimpiada}
                onClick={() => setState(prev => ({ ...prev, selectedOlimpiada: olimpiada.idOlimpiada }))}
                className={`selector-btn ${
                  state.selectedOlimpiada === olimpiada.idOlimpiada ? 'active' : ''
                } ${olimpiada.nombreEstado === 'EN INSCRIPCION' ? 'inscripcion' : 'planificacion'}`}
              >
                {olimpiada.nombreOlimpiada} ({olimpiada.anio})
                {state.selectedOlimpiada === olimpiada.idOlimpiada && (
                  <div className="active-indicator"></div>
                )}
                <span className={`status-indicator ${olimpiada.nombreEstado === 'EN INSCRIPCION' ? 'inscripcion' : 'planificacion'}`}>
                  {olimpiada.nombreEstado === 'EN INSCRIPCION' ? <FaLock /> : <FaEdit/>}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="refresh-btn"
            onClick={() => fetchData(true)}
            disabled={state.loading}
          >
            <FiRefreshCw className={state.loading ? 'spinning' : ''} />
          </button>
          <button
            className={`add-btn ${currentOlimpiada?.nombreEstado === 'EN INSCRIPCION' ? 'disabled' : ''}`}
            onClick={() => setState(prev => ({ ...prev, modalOpen: true }))}
            disabled={!state.selectedOlimpiada || state.loading || currentOlimpiada?.nombreEstado === 'EN INSCRIPCION'}
            title={currentOlimpiada?.nombreEstado === 'EN INSCRIPCION' ? 'No se puede agregar durante inscripción' : 'Agregar nuevo ítem'}
          >
            <FiPlus /> {currentOlimpiada?.nombreEstado === 'EN INSCRIPCION' ? 'Bloqueado' : 'Nuevo Item'}
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
                  onClick={() => setState(prev => ({ ...prev, modalOpen: true, isEditing: false, itemToEdit: null }))}
                  disabled={!state.selectedOlimpiada}
                >
                  <FiPlus /> Crear primera configuración
                </button>
              </div>
            ) : (
              <CatalogCard
                items={filteredCatalogo}
                onEdit={handleEdit}
                isInscripcion={currentOlimpiada?.nombreEstado === 'EN INSCRIPCION'}
              />
            )}
          </>
        )}
      </main>

      {state.modalOpen && (
        <CatalogModal
          areas={state.areas}
          categories={state.categories}
          grados={state.grados} 
          onClose={closeModal}
          onSubmit={handleAddItem}
          isEditing={state.isEditing}
          itemData={state.itemToEdit}
        />
      )}
    </div>
  );
};

export default CatalogoManagement;