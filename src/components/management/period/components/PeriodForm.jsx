import React, { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { savePeriodoOlimpiada, updatePeriodoOlimpiada } from '../../../../api/api';
import Swal from 'sweetalert2';
import './PeriodForm.css';

export default function PeriodForm({
  selectedOlimpiada,
  editing,
  periods,
  onClose,
  onSave,
  validateDateOverlap
}) {
  const [formData, setFormData] = useState({
    nombrePeriodo: '',
    fechaInicio: '',
    fechaFin: '',
    tipoPeriodo: '',
  });
  const [originalData, setOriginalData] = useState(null); 
  const [validationError, setValidationError] = useState('');
  const [hasInscripcionPeriod, setHasInscripcionPeriod] = useState(false);

  useEffect(() => {
    const inscripcionExists = periods.some(p =>
      p.tipoPeriodo === 'INSCRIPCION' &&
      (!editing || p.idPeriodo !== editing.idPeriodo)
    );
    setHasInscripcionPeriod(inscripcionExists);

    if (editing) {
      const editingData = {
        nombrePeriodo: editing.nombrePeriodo || '',
        fechaInicio: editing.fechaInicio || '',
        fechaFin: editing.fechaFin || '',
        tipoPeriodo: editing.tipoPeriodo || '',
      };
      setFormData(editingData);
      setOriginalData(editingData); 
    } else {
      const newData = {
        nombrePeriodo: '',
        fechaInicio: '',
        fechaFin: '',
        tipoPeriodo: inscripcionExists ? 'AMPLIACION' : 'INSCRIPCION',
      };
      setFormData(newData);
      setOriginalData(null);
    }
    setValidationError('');
  }, [editing, periods]);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await savePeriodoOlimpiada({
        idOlimpiada: selectedOlimpiada,
        ...data
      });

      if (response.data?.status === 'error') {
        throw new Error(response.data.message);
      }

      return response;
    },
    onSuccess: (data) => {
      Swal.fire({
        title: '¡Éxito!',
        text: 'El período ha sido creado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#667eea'
      }).then(() => {
        onSave();
      });
    },
    onError: (error) => {
      console.error('Error creando período:', error);
      Swal.fire({
        title: 'Error',
        text: error?.response?.data?.message || error?.message || 'Error al crear el período. Intente nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ef4444'
      });
    }
  });

  const getChangedFields = useCallback(() => {
    if (!originalData) return formData; 

    const changes = {};

    if (formData.nombrePeriodo !== originalData.nombrePeriodo) {
      changes.nombre_personalizado = formData.nombrePeriodo.trim();
    }

    if (formData.fechaInicio !== originalData.fechaInicio) {
      changes.fecha_inicio = formData.fechaInicio;
    }

    if (formData.fechaFin !== originalData.fechaFin) {
      changes.fecha_fin = formData.fechaFin;
    }

    return changes;
  }, [formData, originalData]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const changedFields = getChangedFields();

      if (Object.keys(changedFields).length === 0) {
        throw new Error('No se detectaron cambios para actualizar');
      }

      const updatePayload = {
        idPeriodo: editing.idPeriodo,
        idOlimpiada: selectedOlimpiada
      };

      if ('fecha_inicio' in changedFields) {
        updatePayload.fechaInicio = changedFields.fecha_inicio;
      }
      if ('fecha_fin' in changedFields) {
        updatePayload.fechaFin = changedFields.fecha_fin;
      }
      if ('nombre_personalizado' in changedFields) {
        updatePayload.nombrePeriodo = changedFields.nombre_personalizado;
      }


      const response = await updatePeriodoOlimpiada(editing.idPeriodo, updatePayload);

      if (response.data?.status === 'error') {
        throw new Error(response.data.message);
      }

      return response;
    },
    onSuccess: (data) => {
      Swal.fire({
        title: '¡Actualizado!',
        text: 'El período ha sido actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#667eea'
      }).then(() => {
        onSave();
      });
    },
    onError: (error) => {
      console.error('Error actualizando período:', error);
      Swal.fire({
        title: 'Error',
        text: error?.response?.data?.message || error?.message || 'Error al actualizar el período. Intente nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ef4444'
      });
    }
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'fechaInicio' || name === 'fechaFin') {
      setValidationError('');
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.nombrePeriodo.trim()) {
      setValidationError('El nombre del período es requerido');
      return;
    }

    if (!formData.fechaInicio || !formData.fechaFin) {
      setValidationError('Las fechas de inicio y fin son requeridas');
      return;
    }

    if (new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
      setValidationError('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    // Para edición, verificar si hay cambios
    if (editing && originalData) {
      const hasChanges = Object.keys(getChangedFields()).length > 0;
      if (!hasChanges) {
        Swal.fire({
          title: 'Sin cambios',
          text: 'No se detectaron cambios para actualizar.',
          icon: 'info',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#667eea'
        });
        return;
      }
    }

    const validation = validateDateOverlap(
      formData,
      editing?.idPeriodo || null
    );

    if (!validation.isValid) {
      setValidationError(validation.message);
      Swal.fire({
        title: 'Error de Validación',
        text: validation.message,
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      if (editing && editing.idPeriodo) {
        await updateMutation.mutateAsync();
      } else {
        const dataToSend = {
          nombrePeriodo: formData.nombrePeriodo.trim(),
          fechaInicio: formData.fechaInicio,
          fechaFin: formData.fechaFin,
          tipoPeriodo: formData.tipoPeriodo,
        };
        await createMutation.mutateAsync(dataToSend);
      }
    } catch (error) {
      console.error('Error en mutación:', error);
    }
  }, [formData, originalData, editing, validateDateOverlap, createMutation, updateMutation, getChangedFields]);

  const handleClose = () => {
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }
    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Función helper para mostrar qué campos han cambiado (opcional, para debugging)
  const getChangedFieldsDisplay = () => {
    if (!editing || !originalData) return null;

    const changes = getChangedFields();
    const changesList = Object.keys(changes);

    if (changesList.length === 0) return null;

    return (
      <div className="pf-changes-preview" style={{
        fontSize: '12px',
        color: '#666',
        marginBottom: '10px',
        padding: '8px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <strong>Cambios detectados:</strong> {changesList.join(', ')}
      </div>
    );
  };

  return (
    <div className="pf-period-form-container">
      <div className="pf-period-form-modal">
        <div className="pf-period-form-header">
          <h3>{editing ? 'Editar Período' : 'Nuevo Período'}</h3>
          <button
            onClick={handleClose}
            className="pf-btn-close"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pf-period-form">
          {/* Mostrar cambios detectados (opcional) */}
          {getChangedFieldsDisplay()}

          <div className="pf-form-group">
            <label htmlFor="nombrePeriodo">Nombre del Período:</label>
            <input
              type="text"
              id="nombrePeriodo"
              name="nombrePeriodo"
              value={formData.nombrePeriodo}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder="Ej: Inscripciones Fase 1"
            />
          </div>

          <div className="pf-form-group">
            <label htmlFor="fechaInicio">Fecha de Inicio:</label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="pf-form-group">
            <label htmlFor="fechaFin">Fecha de Fin:</label>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="pf-form-group">
            <label htmlFor="tipoPeriodo">Tipo de Período:</label>
            <select
              id="tipoPeriodo"
              name="tipoPeriodo"
              value={formData.tipoPeriodo}
              onChange={handleInputChange}
              disabled={isLoading || (hasInscripcionPeriod && !editing)}
            >
              <option
                value="INSCRIPCION"
                disabled={hasInscripcionPeriod && !editing}
              >
                INSCRIPCION {hasInscripcionPeriod && !editing && '(Ya existe)'}
              </option>
              <option value="AMPLIACION">AMPLIACION</option>
            </select>
            {hasInscripcionPeriod && !editing && (
              <p className="pf-form-hint">
                Solo puede haber un período de INSCRIPCIONES. Puedes agregar múltiples AMPLIACIONES.
              </p>
            )}
          </div>

          {validationError && (
            <div className="pf-validation-error">
              {validationError}
            </div>
          )}

          <div className="pf-form-actions">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="pf-btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`pf-btn-save ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? 'Guardando...' : (editing ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}