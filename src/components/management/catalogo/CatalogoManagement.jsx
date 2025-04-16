import { useState, useEffect } from 'react';
import CatalogForm from './CatalogForm';
import CatalogCard from './CatalogCard';
import { getAreas, getCatalogoOlimpiada, getGradosCategorias, getOlimpiadas } from '../../../api/api';
import Swal from 'sweetalert2';
import './CatalogoManagement.css';

const CatalogoMangament = () => {
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [olimpiadas, setOlimpiadas] = useState([]);
    const [activeOlimpiadaId, setActiveOlimpiadaId] = useState(null);
    const [catalogoById, setCatalogoById] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [olimpiadaRes, areasRes, categoriesRes, catalogoRes] = await Promise.all([
                getOlimpiadas(),
                getAreas(),
                getGradosCategorias(),
                getCatalogoOlimpiada(),
            ]);
            const olimpiadasData = olimpiadaRes.data?.data || [];
            const active = olimpiadasData.find(o => o.estadoOlimpiada === true)?.idOlimpiada || null;
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
                text: 'Error al cargar los catalogos',
              });     
        } finally {
            setIsLoading(false);
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

            <CatalogForm
                areas={areas}
                categories={categories}
            />

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
                            grades={item.grados}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
export default CatalogoMangament;
