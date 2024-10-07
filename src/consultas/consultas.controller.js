import {
  cambiarFormatoFechaGuion,
  capitalizeFullName,
} from "../../assets/tools.js";
import { consultasService } from "./consultas.service.js";

export function consultasController(data) {
  const nombrePaciente = data.Paciente;
  const fechaValidacion = data.FechaValidacion;
  const dateForTitle = cambiarFormatoFechaGuion(fechaValidacion);
  if (data.Paciente == undefined) {
    console.log("Chech your INFO");
  }

  if (data.consulta === undefined || data.consulta === null) {
    console.log(
      "PACIENTE: " +
        data.Paciente +
        " HAS NO DATA FOR THIS EXAM, CHECK WITH DOCTOR"
    );
  } else {
    if (data.consulta == 1) {
      consultasService(
        "./files/consultas/primerConsultaInd.pdf",
        capitalizeFullName(nombrePaciente) +
          " Primer Consulta " +
          dateForTitle +
          ".pdf",
        data
      );
    }
    if (data.consulta == 2) {
      consultasService(
        "./files/consultas/consultaSeguimientoInd.pdf",
        capitalizeFullName(nombrePaciente) +
          " Consulta de Seguimiento " +
          dateForTitle +
          ".pdf",
        data
      );
    }
    if (data.consulta == 3) {
      consultasService(
        "./files/consultas/consultaGuardia.pdf",
        capitalizeFullName(nombrePaciente) +
          " Consulta de Guardia " +
          dateForTitle +
          ".pdf",
        data
      );
    }
  }
}
