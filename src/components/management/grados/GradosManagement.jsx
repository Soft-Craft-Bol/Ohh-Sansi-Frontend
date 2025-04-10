import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import { getNivelEscolar, getAreas, createCategory, getAreasGrados } from "../../../api/api";
import { toast } from "sonner";
import { IoCloseOutline } from "react-icons/io5";
import GradosValidate from "../../../schemas/GradosValidation";
import "./GradosManagement.css";
import ManagementCard from "../../cards/ManagementCard";
import { ordenarGrados } from "../../../utils/GradesOrder";

const GradosManagement = () => {
    const [data, setData] = useState([]);
    const [nivelesEscolares, setNivelesEscolares] = useState([]);
    const [areas, setAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [nivelesRes, areasRes] = await Promise.all([
                getNivelEscolar(),
                getAreas()
            ]);
            setNivelesEscolares(nivelesRes.data || []);
            setAreas(areasRes.data?.areas || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error al cargar los datos");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAreasWithGrados();
    }, []);

    const fetchAreasWithGrados = async () => {
        try {
            setIsLoading(true);
            const response = await getAreasGrados();
            console.log("Areas con grados:", response.data);
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener áreas con grados:", error);
            toast.error("Error al cargar grados asociados");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="category-container">
            <h2>Asociar Grados Escolares</h2>
            <p>Asociar grados escolares a área de competencia</p>

            <Formik
                initialValues={{
                    idArea: "",
                    nivelesEscolares: [],
                }}
                validationSchema={GradosValidate}
                onSubmit={async (values, { resetForm }) => {
                    console.log('Datos a enviar:', values);
                    try {
                        const response = await createCategory(values);
                        setData(prev => [...prev, response.data]);
                        toast.success("Grado creado correctamente");
                        resetForm();
                    } catch (error) {
                        console.error("Error creating:", error);
                        toast.error(`Error al crear el grado"}`);
                    }
                }}
                enableReinitialize={true}
            >
                {({ values, setFieldValue, errors, touched }) => {
                    const toggleGrade = (nivelId) => {
                        const newGrades = values.nivelesEscolares.includes(nivelId)
                            ? values.nivelesEscolares.filter(id => id !== nivelId)
                            : [...values.nivelesEscolares, nivelId];

                        setFieldValue("nivelesEscolares", newGrades);
                    };

                    const availableGrades = nivelesEscolares.filter(
                        nivel => !values.nivelesEscolares.includes(nivel.idNivel)
                    );

                    return (
                        <Form>
                            <div className="selection-container">
                                <label>Áreas disponibles:</label>
                                <select
                                    onChange={(e) => setFieldValue("idArea", parseInt(e.target.value))}
                                    value={values.idArea}
                                >
                                    <option value="">Seleccione un área</option>
                                    {areas.map(area => (
                                        <option key={area.idArea} value={area.idArea}>
                                            {area.nombreArea}
                                        </option>
                                    ))}
                                </select>
                                {errors.idArea && touched.idArea && (
                                    <div className="error-message">{errors.idArea}</div>
                                )}
                            </div>


                            <div className="selection-container">
                                <label>Grados escolares:</label>
                                <select
                                    onChange={(e) => toggleGrade(parseInt(e.target.value))}
                                    value=""
                                >
                                    <option value="">Seleccione un grado escolar</option>
                                    {ordenarGrados(nivelesEscolares).map(nivel => (
                                        <option key={nivel.idNivel} value={nivel.idNivel}>
                                            {nivel.nombreNivelEscolar}
                                        </option>
                                    ))}
                                </select>

                                <div className="selected-items">
                                    <h4>Grados seleccionados:</h4>
                                    {values.nivelesEscolares.length === 0 ? (
                                        <p>No hay grados seleccionados</p>
                                    ) : (
                                        ordenarGrados(
                                            nivelesEscolares.filter(n => values.nivelesEscolares.includes(n.idNivel))
                                        ).map(nivel => (
                                            <span
                                                key={nivel.idNivel}
                                                className="selected-item"
                                                onClick={() => toggleGrade(nivel.idNivel)}
                                            >
                                                {nivel.nombreNivelEscolar}
                                                <IoCloseOutline size={16} color="red" />
                                            </span>
                                        ))
                                    )}
                                </div>
                                {errors.nivelesEscolares && touched.nivelesEscolares && (
                                    <div className="error-message">{errors.nivelesEscolares}</div>
                                )}
                            </div>

                            <ButtonPrimary type="submit" disabled={isLoading}>
                                Crear area de competencia
                            </ButtonPrimary>
                        </Form>
                    );
                }}
            </Formik>

<<<<<<< HEAD
            <h3>Grados registrados</h3>
=======
            <h2>Grados registrados</h2>
>>>>>>> 84d4d2cb383d1665a6f146b6369dcca706449a3c
            {data?.areasgrades?.length > 0 ? (
                <div className="categories-list">
                    {data.areasgrades.map((item, index) => (
                        <ManagementCard
                            key={index}
                            title={`Área: ${item.nombreArea}`}
                            info={[
                                { label: "Nombre corto", value: item.nombreCortoArea },
                                { label: "Descripción", value: item.descripcionArea },
                                { label: "Grados", value: item.codigoNivel || "Ninguno" }
                            ]}
                        />
                    ))}
                </div>
            ) : (
                <p>No hay grados registrados.</p>
            )}
        </div>
    );
};

export default GradosManagement;