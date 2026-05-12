import {
  cambiarFormatoFechaGuion,
  capitalizeFullName,
  numeroAlAzar,
} from "../../assets/tools.js";
import { paquiService } from "./paqui.service.js";

export function paquiController(data) {
  let Paquimetria = "";

  if (data.Paquimetria) {
    Paquimetria = data.Paquimetria.toLowerCase();
  } else {
    Paquimetria = "a";
  }
  if (Paquimetria == "x") {
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const fechaValidacion = data.FechaValidacion;
    const dateForTitle = cambiarFormatoFechaGuion(fechaValidacion);
    if (data.paquiOD === undefined || data.paquiOI === undefined) {
      data.paquiOD = numeroAlAzar(520, 580);
      data.paquiOI = numeroAlAzar(520, 580);
      paquiService(
        "./files/paqui/modeloPaqui.pdf",
        capitalizeFullName(nombrePaciente) + "_PAQUI_" + dateForTitle + ".pdf",
        data
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
