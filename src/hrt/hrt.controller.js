import {
  capitalizeFullName,
  numeroAlAzar,
  quitarPuntosDNI,
} from "../../assets/tools.js";
import { hrtService } from "./hrt.service.js";

export function hrtController(data) {
  if (data.HRT == "x") {
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const fechaNacimiento = data.FechaDeNacimiento;
    const fechaValidacion = data.FechaValidacion;
    let genero = data.genero;
    if (genero == "h") {
      genero = "Male";
    }
    if (genero == "m") {
      genero = "Female";
    }
    if (genero == undefined) {
      console.log("Falta completar genero de: ", nombrePaciente);
    }
    const partesNombre = capitalizeFullName(nombrePaciente).replace(/ /g, "_");

    function cambiarFormatoFechaJunta(fecha) {
      var partesFecha = fecha.split("/");
      var fechaObjeto = new Date(
        partesFecha[2],
        partesFecha[1] - 1,
        partesFecha[0]
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
      var nuevaFecha = año.toString() + mes.toString() + dia.toString();
      return nuevaFecha;
    }
    const fechaSinEspacios = cambiarFormatoFechaJunta(fechaNacimiento);
    const fechaEstudioSinEspacios = cambiarFormatoFechaJunta(fechaValidacion);

    hrtService(
      "./files/hrt/" + numeroAlAzar(1, 6) + ".pdf",
      partesNombre +
        "_" +
        dniPaciente +
        "_" +
        fechaSinEspacios +
        "_" +
        genero +
        "_Optic Disc Cube 128x128_" +
        fechaEstudioSinEspacios +
        "_OU_ONH _ RNFL Analysis_" +
        fechaEstudioSinEspacios +
        ".pdf",
      data
    );
  }
}
