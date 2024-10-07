import {
  cambiarFormatoFechaGuion,
  capitalizeFullName,
} from "../../assets/tools.js";
import { paquiService } from "./paqui.service.js";

export function paquiController(data) {
  if (data.Paquimetria == "x") {
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const fechaValidacion = data.FechaValidacion;
    const dateForTitle = cambiarFormatoFechaGuion(fechaValidacion);
    if (data.paquiOD === undefined || data.paquiOI === undefined) {
      console.log(
        "PACIENTE: " +
          data.Paciente +
          " HAS NO DATA FOR THIS EXAM, CHECK WITH DOCTOR"
      );
    } else {
      paquiService(
        "./files/paqui/modeloPaqui.pdf",
        capitalizeFullName(nombrePaciente) + "_PAQUI_" + dateForTitle + ".pdf",
        data
      );
    }
  }
}
