import {
  cambiarFormatoFecha,
  capitalizeFullName,
  quitarPuntosDNI,
} from "../../assets/tools.js";
import { camposService } from "./campos.service.js";

export default function camposController(data) {
  if (data.CampoVisual == "x") {
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const fechaNacimiento = data.FechaDeNacimiento;
    const partesFecha = cambiarFormatoFecha(fechaNacimiento).split("-");
    function numeroAlAzar(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    let genero = data.genero;
    if (genero == "h") {
      genero = "Hombre";
    }
    if (genero == "m") {
      genero = "Mujer";
    }
    if (genero == undefined) {
      console.log("GENERO: ", data[i].genero);
      console.log("Falta completar genero de: ", nombrePaciente);
    }
    const partesNombre = capitalizeFullName(nombrePaciente).replace(/ /g, "_");

    if (data.negroOD == "x") {
      console.log("NEGRO OD", nombrePaciente);
      camposService(
        "./files/campos/negros/negroOD/1.pdf",

        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          partesFecha[0] +
          "_" +
          partesFecha[1] +
          "_" +
          partesFecha[2] +
          "_Both_eyes.pdf",
        data
      );
    } else if (data.negroOI == "x") {
      console.log("NEGRO OI", nombrePaciente);
      camposService(
        "./files/campos/negros/negroOS/" + numeroAlAzar(1, 2) + ".pdf",

        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          partesFecha[0] +
          "_" +
          partesFecha[1] +
          "_" +
          partesFecha[2] +
          "_Both_eyes.pdf",
        data
      );
    } else if (data.negroOA == "x") {
      console.log("NEGRO OA", nombrePaciente);
      camposService(
        "./files/campos/negros/negroOA/1.pdf",

        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          partesFecha[0] +
          "_" +
          partesFecha[1] +
          "_" +
          partesFecha[2] +
          "_Both_eyes.pdf",
        data
      );
    } else {
      console.log("NORMAL", nombrePaciente);
      camposService(
        "./files/campos/" + numeroAlAzar(1, 6) + ".pdf",

        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          partesFecha[0] +
          "_" +
          partesFecha[1] +
          "_" +
          partesFecha[2] +
          "_Both_eyes.pdf",
        data
      );
    }
  }
}
