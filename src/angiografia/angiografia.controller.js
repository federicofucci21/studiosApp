import {
  numeroAlAzar,
  quitarPuntosDNI,
  sumarMinutosAHorario,
} from "../../assets/tools.js";
import { angiografiaService } from "./angiografia.service.js";

export function angiografiaController(data) {
  let Angiografia = "";

  if (data.Angiografia) {
    Angiografia = data.Angiografia.toLowerCase();
  } else {
    Angiografia = "a";
  }
  if (Angiografia == "x") {
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const fechaValidacion = data.FechaValidacion;
    const numAfiliado = data.Afiliado;
    const hora = data.Hora;
    let genero = data.genero;
    if (genero === "h") {
      genero = "Hombre";
    }
    if (genero == "m") {
      genero = "Mujer";
    }
    if (genero == undefined) {
      console.log("Falta completar genero de: ", nombrePaciente);
    }
    const partesNombre = nombrePaciente.toUpperCase().replace(/ /g, "_");

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

    function cambiarFormatoFechaJunta(fecha) {
      var partesFecha = fecha.split("/");
      var fechaObjeto = new Date(
        partesFecha[2],
        partesFecha[1] - 1,
        partesFecha[0]
      );

      var dia = fechaObjeto.getDate().toString();
      var mes = (fechaObjeto.getMonth() + 1).toString();
      var año = fechaObjeto.getFullYear().toString();

      // Añadir ceros iniciales si es necesario
      if (dia < 10) {
        dia = "0" + dia;
      }
      if (mes < 10) {
        mes = "0" + mes;
      }

      // Construir la cadena con el nuevo formato
      var nuevaFecha = año + mes + dia;
      return nuevaFecha;
    }

    const fechaEstudioSinEspacios = cambiarFormatoFechaJunta(fechaValidacion);
    function removerDosPuntos(horario) {
      return horario.replace(/:/g, "");
    }
    const minutos = 16;
    const horario = sumarMinutosAHorario(hora, minutos) + ":23";

    angiografiaService(
      "./files/angiografia/ao/" + numeroAlAzar(1, 10) + ".pdf",
      // "./files/angiografia/ao/7.pdf",

      dniPaciente +
        "_" +
        partesNombre +
        "_" +
        fechaEstudioSinEspacios +
        "_" +
        removerDosPuntos(horario) +
        "_Retina_Angio_Amplio_AMBOS_OJOS_6mm_320x320.pdf",
      data
    );
  }
}
