import { useState, useEffect } from 'react';
import CatalogForm from './CatalogForm';
import CatalogCard from './CatalogCard';
import { getAreas, getCatalogoOlimpiada, getGradosCategorias, getOlimpiadas, saveCatalogoOlimpiada } from '../../../api/api';
import Swal from 'sweetalert2';
import './CatalogoManagement.css';

const CatalogoMangament = () => {
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [olimpiadas, setOlimpiadas] = useState([]);
    const [activeOlimpiadaId, setActiveOlimpiadaId] = useState(null);
    const [catalogoById, setCatalogoById] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [olimpiadaRes, areasRes, categoriesRes, catalogoRes] = await Promise.all([
                getOlimpiadas(),
                getAreas(),
                getGradosCategorias(),
                getCatalogoOlimpiada(),
            ]);
            const olimpiadasData = olimpiadaRes.data?.data || [];
            const active = olimpiadasData.find(o => o.estadoOlimpiada)?.idOlimpiada || null;
            setOlimpiadas(olimpiadasData);
            setActiveOlimpiadaId(active);
            setCategories(categoriesRes.data);
            setAreas(Array.isArray(areasRes.data?.areas) ? areasRes.data.areas : []);
            setCatalogoById(catalogoRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los datos.',
            });
        }
    };

    const handleAddCatalogo = async (data) => {
        try {
            const response = await saveCatalogoOlimpiada(data);
    
            if (response?.data?.status === 'success') {
                Swal.fire('Guardado', response.data.message, 'success');
                fetchData();
            } else {
                console.log("Mensaje de error desde backend:", response?.data?.message);
                Swal.fire('Error', response?.data?.message || 'No se pudo guardar.', 'error');
            }
        } catch (error) {
            console.error("Error al guardar:", error);
    
            if (error?.response) {
                Swal.fire('Error', error.response.data?.message || 'No se pudo conectar con el servidor.', 'error');
            } else {
                Swal.fire('Error', 'Error desconocido al conectar con el servidor.', 'error');
            }
        }
    };
    

    const activeOlimpiadaNombre = olimpiadas.find(o => o.idOlimpiada === activeOlimpiadaId)?.nombreOlimpiada || '';
    const catalogosFiltrados = catalogoById.filter(item => item.nombreOlimpiada === activeOlimpiadaNombre);

    return (
        <div className="configurator page-padding">
            <h2>Configuración del Catálogo Olímpico</h2>
            <div className="period-selector">
                {olimpiadas.map((o) => (
                    <button
                        key={o.idOlimpiada}
                        className={`period-btn ${activeOlimpiadaId === o.idOlimpiada ? 'active' : ''}`}
                        onClick={() => setActiveOlimpiadaId(o.idOlimpiada)}
                    >
                        {o.nombreOlimpiada}
                        {o.estadoOlimpiada && <span className="green-dot" />}
                    </button>
                ))}
            </div>

            {activeOlimpiadaId && typeof handleAddCatalogo === 'function' && (
                <CatalogForm
                    areas={areas}
                    categories={categories}
                    activeOlimpiadaId={activeOlimpiadaId}
                    onAdd={handleAddCatalogo}
                />
            )}

            <div className="configured-list">
                <h3>Catálogo Configurado</h3>
                {catalogosFiltrados.length === 0 ? (
                    <p>No hay configuraciones aún para esta olimpiada.</p>
                ) : (
                    catalogosFiltrados.map((item, i) => (
                        <CatalogCard
                            key={i}
                            area={item.nombreArea}
                            categories={item.nombreCategoria}
                            grades={item.grados.join(', ')}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CatalogoMangament;
