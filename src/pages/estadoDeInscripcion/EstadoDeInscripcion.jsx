import React from 'react'
import "./EstadoDeInscripcion.css"
import Header from "../../components/header/Header";

const EstadoDeInscripcion = () => {
  return (
    <div className='estado-inscripcion'>
      <Header 
        title="Estado de Inscripción"
        description="Consulta el estado de tu inscripción"
      />
    </div>
  )
}

export default EstadoDeInscripcion