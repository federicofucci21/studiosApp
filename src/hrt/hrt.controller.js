import {
  capitalizeFullName,
  numeroAlAzar,
  quitarPuntosDNI,
  sumarMinutosAHorario,
} from "../../assets/tools.js";
import { hrtService } from "./hrt.service.js";

export function hrtController(data) {
  let HRT = "";

  if (data.HRT) {
    HRT = data.HRT.toLowerCase();
  } else {
    HRT = "a";
  }
  if (HRT == "x") {
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const fechaNacimiento = data.FechaDeNacimiento;
    const fechaValidacion = data.FechaValidacion;
    const hora = data.Hora;
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
        partesFecha[0],
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
    const minutosHrtD =
      " " + sumarMinutosAHorario(hora, 14) + ":" + numeroAlAzar(10, 59);
    const minutosHrtI =
      " " + sumarMinutosAHorario(hora, 13) + ":" + numeroAlAzar(10, 59);
    const horaTittle = minutosHrtD.toString().replace(/:/g, "");
    const horaTittleI = minutosHrtI.toString().replace(/:/g, "");
    //HRT NORMAL OJO IZQUIERDO SAN PEDRO
    if (data.SP == "x" && data.OI == "x") {
      //OJO IZQUIERDO
      hrtService(
        "./files/hrt/SP/OI/" + numeroAlAzar(1, 2) + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Disco_3D_L_SIMPLE_6mm_512x128.pdf",
        data,
        minutosHrtD,
        minutosHrtI,
        "os",
      );
    }
    //HRT NORMAL OJO DERECHO SAN PEDRO
    else if (data.SP == "x" && data.OD == "x") {
      //OJO DERECHO
      hrtService(
        "./files/hrt/SP/OD/" + "1" + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Disco_3D_L_SIMPLE_6mm_512x128.pdf",
        data,
        minutosHrtD,
        minutosHrtI,
        "od",
      );
    }
    //HRT NORMAL SAN PEDRO
    else if (data.SP == "x") {
      //AMBOS OJOS
      hrtService(
        "./files/hrt/SP/" + numeroAlAzar(1, 10) + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Disco_3D_AMBOS_OJOS_6mm_512x128.pdf",
        data,
        minutosHrtD,
        minutosHrtI,
      );
    } else if (data.OD == "x") {
      hrtService(
        "./files/hrt/ojoUnico/od.pdf",
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
        data,
        minutosHrtD,
        minutosHrtI,
        "od",
      );
    } else if (data.OI == "x") {
      hrtService(
        "./files/hrt/ojoUnico/oi.pdf",
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
        data,
        minutosHrtD,
        minutosHrtI,
        "os",
      );
    } else {
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
        data,
        minutosHrtD,
        minutosHrtI,
      );
    }
  }
}
