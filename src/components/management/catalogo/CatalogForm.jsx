import { useFormik } from 'formik';
import * as Yup from 'yup';
import MultiSelect from './MultiSelect';
import useFetchGrados from '../../../hooks/NivelEscolar/useFetchGrados';
import useCategoriaFormat from '../../../hooks/areacategories/useCategoriaFormat';
import './CatalogForm.css';

const CatalogForm = ({ areas, categories, onAdd }) => {
    const formik = useFormik({
        initialValues: { area: '', categories: [] },
        validationSchema: Yup.object({
            area: Yup.string().required('Área requerida'),
            categories: Yup.array().min(1, 'Selecciona al menos una categoría'),
        }),
        onSubmit: (values, { resetForm }) => {
            onAdd(values);
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
                    {areas.map(area => <option key={area} value={area.nombreArea}>{area.nombreArea}</option>)}
                </select>
                {formik.touched.area && formik.errors.area && (
                    <p className="error-msg">{formik.errors.area}</p>
                )}
            </div>

            <MultiSelect
                value={formik.values.categories}
                onChange={(val) => formik.setFieldValue('categories', val)}
                options={categoriasFormateadas}
                error={formik.touched.categories && formik.errors.categories}
            />

            <button type="submit" className="submit-button">+ Añadir al Catálogo</button>
        </form>
    );
};

export default CatalogForm;
