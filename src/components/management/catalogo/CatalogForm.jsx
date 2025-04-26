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
        <form className="catalog-form" onSubmit={formik.handleSubmit}>
            <div className="form-group">
                <label>Área</label>
                <select
                    name="area"
                    value={formik.values.area}
                    onChange={formik.handleChange}
                    className={formik.touched.area && formik.errors.area ? 'error' : ''}
                >
                    <option value="">Seleccionar área</option>
                    {areas.map(area => (
                        <option key={area.idArea} value={area.idArea}>
                            {area.nombreArea}
                        </option>
                    ))}
                </select>
                {formik.touched.area && formik.errors.area && (
                    <p className="error-msg">{formik.errors.area}</p>
                )}
            </div>

            <div className="form-group">
                <label>Categoría</label>
                <select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    className={formik.touched.category && formik.errors.category ? 'error' : ''}
                >
                    <option value="">Seleccionar categoría</option>
                    {categoriasFormateadas.map(cat => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                    <p className="error-msg">{formik.errors.category}</p>
                )}
            </div>

            <button type="submit" className="submit-button">+ Añadir al Catálogo</button>
        </form>
    );
};

export default CatalogForm;
