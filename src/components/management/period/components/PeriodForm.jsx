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
  const [validationError, setValidationError] = useState('');
  const [hasInscripcionPeriod, setHasInscripcionPeriod] = useState(false);

  useEffect(() => {
    const inscripcionExists = periods.some(p =>
      p.tipoPeriodo === 'INSCRIPCION' &&
      (!editing || p.idPeriodo !== editing.idPeriodo)
    );
    setHasInscripcionPeriod(inscripcionExists);

    if (editing) {
      setFormData({
        nombrePeriodo: editing.nombrePeriodo || '',
        fechaInicio: editing.fechaInicio || '',
        fechaFin: editing.fechaFin || '',
        tipoPeriodo: editing.tipoPeriodo || '',
      });
    } else {
      setFormData({
        nombrePeriodo: '',
        fechaInicio: '',
        fechaFin: '',
        tipoPeriodo: inscripcionExists ? 'AMPLIACION' : 'INSCRIPCION',
      });
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

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      console.log('Datos a enviar para actualizar:', data);
      console.log('ID del período a actualizar:', editing.idPeriodo);
      const response = await updatePeriodoOlimpiada(editing.idPeriodo, {
        idPeriodo: editing.idPeriodo,
        idOlimpiada: selectedOlimpiada,
        ...data
      });
      console.log('Respuesta del servidor (actualizar):', response);

      if (response.data?.status === 'error') {
        throw new Error(response.data.message);
      }

      return response;
    },
    onSuccess: (data) => {
      console.log('Período actualizado exitosamente:', data);
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

    const dataToSend = {
      nombrePeriodo: formData.nombrePeriodo.trim(),
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      tipoPeriodo: formData.tipoPeriodo,
    };

    try {
      if (editing && editing.idPeriodo) {
        await updateMutation.mutateAsync(dataToSend);
      } else {
        await createMutation.mutateAsync(dataToSend);
      }
    } catch (error) {
      console.error('Error en mutación:', error);
    }
  }, [formData, editing, validateDateOverlap, createMutation, updateMutation, selectedOlimpiada]);

  const handleClose = () => {
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }
    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

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