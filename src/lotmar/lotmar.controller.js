import {
  cambiarFormatoFechaGuion,
  capitalizeFullName,
} from "../../assets/tools.js";
import { lotmarService } from "./lotmar.service.js";

export function lotmarController(data) {
  if (data.lotmarOD === undefined || data.lotmarOI === undefined) {
    console.log(
      "PACIENTE: " +
        data.Paciente +
        " HAS NO DATA FOR THIS EXAM, CHECK WITH DOCTOR"
    );
  } else {
    if (data.Lotmar == "x") {
      const nombrePaciente = data.Paciente.replace(/\n$/, "");
      const fechaValidacion = data.FechaValidacion;
      const dateForTitle = cambiarFormatoFechaGuion(fechaValidacion);
      lotmarService(
        "./files/lotmar/modeloLotmar.pdf",
        capitalizeFullName(nombrePaciente) + "_LOTMAR_" + dateForTitle + ".pdf",
        data
      );
    }
  }
}
