import { useFormik } from 'formik';
import * as Yup from 'yup';
import useFetchGrados from '../../../hooks/NivelEscolar/useFetchGrados';
import useCategoriaFormat from '../../../hooks/areacategories/useCategoriaFormat';
import './CatalogForm.css';

const CatalogForm = ({ areas = [], categories = [], activeOlimpiadaId, onAdd }) => {
    const formik = useFormik({
        initialValues: { area: '', category: '' },
        validationSchema: Yup.object({
            area: Yup.string().required('Área requerida'),
            category: Yup.string().required('Categoría requerida'),
        }),
        onSubmit: (values, { resetForm }) => {

            const payload = {
                idArea: parseInt(values.area),
                idCategoria: parseInt(values.category),
                idOlimpiada: parseInt(activeOlimpiadaId)
            };
            onAdd(payload);
            resetForm();

        }
    });
    const { grados } = useFetchGrados();
    const categoriasFormateadas = useCategoriaFormat(categories, grados);

    return (
        <div className="cf-container">
            <form className="cf-form-grid" onSubmit={formik.handleSubmit}>
                <div className="cf-form-group">
                    <label className="cf-form-label">Área</label>
                    <div className="cf-select-wrapper">
                        <select
                            name="area"
                            value={formik.values.area}
                            onChange={formik.handleChange}
                            className="cf-select"
                        >
                            <option value="">Seleccionar área</option>
                            {areas.map(area => (
                                <option key={area.idArea} value={area.idArea}>
                                    {area.nombreArea}
                                </option>
                            ))}
                        </select>
                        <span className="cf-select-arrow">▼</span>
                    </div>
                    {formik.touched.area && formik.errors.area && (
                        <p className="cf-error-message">{formik.errors.area}</p>
                    )}
                </div>
                <div className="cf-form-group">
                    <label className="cf-form-label">Categoría</label>
                    <div className="cf-select-wrapper">
                        <select
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            className="cf-select"
                        >
                            <option value="">Seleccionar categoría</option>
                            {categoriasFormateadas.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        <span className="cf-select-arrow">▼</span>
                    </div>
                    {formik.touched.category && formik.errors.category && (
                        <p className="cf-error-message">{formik.errors.category}</p>
                    )}
                </div>
                <button type="submit" className="cf-submit-btn">
                    + Añadir al Catálogo
                </button>
            </form>
        </div>
    );
};

export default CatalogForm;
