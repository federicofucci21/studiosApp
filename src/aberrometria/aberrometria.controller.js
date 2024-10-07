import {
  cambiarFormatoFecha,
  numeroAlAzar,
  quitarPuntosDNI,
} from "../../assets/tools.js";
import { aberrometriaService } from "./aberrometria.service.js";

export function aberrometriaController(data) {
  if (data.Aberrometria == "x") {
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const fechaNacimiento = data.FechaDeNacimiento;
    const fechaValidacion = data.FechaValidacion;

    const partesNombre = nombrePaciente.toUpperCase().replace(/ /g, "_");

    const partesFechaNacimiento =
      cambiarFormatoFecha(fechaNacimiento).split("-");

    function cambiarFormatoFechaEstudio(fecha) {
      var partesFechaEstudio = fecha.split("/");
      var fechaObjeto = new Date(
        partesFechaEstudio[2],
        partesFechaEstudio[1] - 1,
        partesFechaEstudio[0]
      );

      var dia = fechaObjeto.getDate();
      var mes = fechaObjeto.getMonth() + 1;
      var año = fechaObjeto.getFullYear();

      // Añadir ceros iniciales si es necesario
      if (dia < 10) {
        dia = "0" + dia;
      }
      if (mes < 10) {
        mes = "0" + mes;
      }

      // Construir la cadena con el nuevo formato
      var nuevaFecha = dia + "-" + mes + "-" + año;
      return nuevaFecha;
    }
    const partesFechaEstudio =
      cambiarFormatoFechaEstudio(fechaValidacion).split("-");

    aberrometriaService(
      "./files/aberrometria/" + numeroAlAzar(1, 10) + ".pdf",

      dniPaciente +
        "_" +
        partesNombre +
        "____" +
        partesFechaNacimiento[0] +
        "_" +
        partesFechaNacimiento[1] +
        "_" +
        partesFechaNacimiento[2] +
        "_OD_OS___" +
        partesFechaEstudio[0] +
        "_" +
        partesFechaEstudio[1] +
        "_" +
        partesFechaEstudio[2] +
        "___ZERNIKE.pdf",
      data
    );
  }
}
