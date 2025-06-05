import * as XLSX from 'xlsx';

export const leerExcelHoja2 = async (file) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  const sheetNames = workbook.SheetNames;
  const requiredSheets = ['Hoja2', 'Hoja4'];

  requiredSheets.forEach(name => {
    if (!sheetNames.includes(name)) {
      throw new Error(`La hoja "${name}" no fue encontrada en el archivo`);
    }
  });

  const hoja2 = workbook.Sheets['Hoja2'];
  const hoja4 = workbook.Sheets['Hoja4'];

  const datosHoja2 = XLSX.utils.sheet_to_json(hoja2, { defval: "" });
  const datosHoja4 = XLSX.utils.sheet_to_json(hoja4, { defval: "" });

  console.log(combinarDatosHoja2y4(datosHoja2, datosHoja4))
  return combinarDatosHoja2y4(datosHoja2, datosHoja4);
};

export const combinarDatosHoja2y4 = (hoja2 = [], hoja4 = []) => {
  return hoja2.map((fila) => {
    const {
      idDepartamento,
      idMunicipio,
      idColegio,
      idGrado,
      participanteHash,
      nombreParticipante,
      apellidoPaterno,
      apellidoMaterno,
      fechaNacimiento,
      carnetIdentidadParticipante,
      complemento,
      emailParticipante,
      tutorRequerido,
      id_tipo_tutor,
      email_tutor,
      nombres_tutor,
      apellidos_tutor,
      telefono,
      carnet_identidad_tutor,
      complemento_ci_tutor,
      id_tutor_parentesco
    } = fila;

    const participante = {
      idDepartamento,
      idMunicipio,
      idColegio,
      idGrado,
      participanteHash,
      nombreParticipante,
      apellidoPaterno,
      apellidoMaterno,
      fechaNacimiento,
      carnetIdentidadParticipante,
      complemento,
      emailParticipante,
      tutorRequerido
    };

    const tutor = {
      id_tipo_tutor,
      email_tutor,
      nombres_tutor,
      apellidos_tutor,
      telefono,
      carnet_identidad_tutor,
      complemento_ci_tutor,
      id_tutor_parentesco
    };

    const relacion = hoja4.find(() => true);

    const areas = relacion
      ? {
          id_area: relacion.id_area,
          id_area2: relacion.id_area2
        }
      : {};

    const profesor = relacion
      ? [
          {
            email_tutor: relacion.email_tutor,
            nombres_tutor: relacion.nombres_tutor,
            apellidos_tutor: relacion.apellidos_tutor,
            telefono: relacion.telefono,
            carnet_identidad_tutor: relacion.carnet_identidad_tutor,
            complemento_ci_tutor: relacion.complemento_ci_tutor
          },
          {
            email_tutor: relacion.email_tutor2,
            nombres_tutor: relacion.nombres_tutor2,
            apellidos_tutor: relacion.apellidos_tutor2,
            telefono: relacion.telefono2,
            carnet_identidad_tutor: relacion.carnet_identidad_tutor2,
            complemento_ci_tutor: relacion.complemento_ci_tutor2
          }
        ]
      : [];

    return {
      participante,
      tutor,
      areas,
      profesor
    };
  });
};

