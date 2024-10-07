import {
  cambiarFormatoFechaGuion,
  capitalizeFullName,
  numeroAlAzar,
} from "../../assets/tools.js";
import { iolService } from "./iol.service.js";

export function iolController(data) {
  if (data.Paciente) {
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const fechaValidacion = data.FechaValidacion;
    const dateForTitle = cambiarFormatoFechaGuion(fechaValidacion);

    if (data.IOL == "x") {
      if (data.OS == "x") {
        iolService(
          "./files/iol/iolOs/" + numeroAlAzar(1, 7) + ".pdf",
          capitalizeFullName(nombrePaciente) +
            "_IOL MASTER_" +
            dateForTitle +
            ".pdf",
          data
        );
      } else {
        if (data.iolOD === undefined || data.iolOI === undefined) {
          console.log(
            "PACIENTE: " +
              data.Paciente +
              " HAS NO DATA FOR THIS EXAM, CHECK WITH DOCTOR"
          );
        } else {
          iolService(
            "./files/iol/iol/modeloIol.pdf",
            capitalizeFullName(nombrePaciente) +
              "_IOL MASTER_" +
              dateForTitle +
              ".pdf",
            data
          );
        }
      }
    }
  }
}
