import {
  cambiarFormatoFechaGuion,
  capitalizeFullName,
  numeroAlAzar,
} from "../../assets/tools.js";
import { microService } from "./micro.service.js";

export function microController(data) {
  let Microscopia = "";

  if (data.Microscopia) {
    Microscopia = data.Microscopia.toLowerCase();
  } else {
    Microscopia = "a";
  }
  if (Microscopia == "x") {
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const fechaValidacion = data.FechaValidacion;
    const dateForTitle = cambiarFormatoFechaGuion(fechaValidacion);
    if (data.microOD === undefined || data.microOI === undefined) {
      data.microOD = numeroAlAzar(1800, 2800);
      data.microOI = numeroAlAzar(1800, 2800);
      microService(
        "./files/microscopia/modeloMicroscopia.pdf",
        capitalizeFullName(nombrePaciente) +
          "_RECUENTO ENDOTELIAL_" +
          dateForTitle +
          ".pdf",
        data
      );
      // console.log(
      //   "PACIENTE: " +
      //     data.Paciente +
      //     " HAS NO DATA FOR THIS EXAM, CHECK WITH DOCTOR"
      // );
    } else {
      microService(
        "./files/microscopia/modeloMicroscopia.pdf",
        capitalizeFullName(nombrePaciente) +
          "_RECUENTO ENDOTELIAL_" +
          dateForTitle +
          ".pdf",
        data
      );
    }
  }
}
