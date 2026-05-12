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
    let IOL = "";

    if (data.IOL) {
      IOL = data.IOL.toLowerCase();
    } else {
      IOL = "a";
    }
    if (IOL == "x") {
      if (data.OS == "x" || data.SP == "x") {
        iolService(
          "./files/iol/iolOs/" + numeroAlAzar(1, 7) + ".pdf",
          capitalizeFullName(nombrePaciente) +
            "_IOL MASTER_" +
            dateForTitle +
            ".pdf",
          data,
        );
      } else {
        if (data.iolOD === undefined || data.iolOI === undefined) {
          data.iolOD = "+21.00";
          data.iolOI = "+21.00";
          iolService(
            "./files/iol/iol/modeloIol.pdf",
            capitalizeFullName(nombrePaciente) +
              "_IOL MASTER_" +
              dateForTitle +
              ".pdf",
            data,
          );
          // console.log(
          //   "PACIENTE: " +
          //     data.Paciente +
          //     " HAS NO DATA FOR THIS EXAM, CHECK WITH DOCTOR"
          // );
        } else {
          iolService(
            "./files/iol/iol/modeloIol.pdf",
            capitalizeFullName(nombrePaciente) +
              "_IOL MASTER_" +
              dateForTitle +
              ".pdf",
            data,
          );
        }
      }
    }
  }
}
