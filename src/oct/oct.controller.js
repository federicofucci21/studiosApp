import {
  cambiarFormatoFecha,
  capitalizeFullName,
  numeroAlAzar,
  quitarPuntosDNI,
} from "../../assets/tools.js";
import { octService } from "./oct.service.js";

export function octController(data) {
  if (data.OCT == "x") {
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

    const fechaSinEspacios = cambiarFormatoFechaJunta(fechaNacimiento);
    const fechaEstudioSinEspacios = cambiarFormatoFechaJunta(fechaValidacion);

    //MASCULOPATIA AMBOS OJOS
    if (data.mascuOA == "x") {
      console.log("MASCU OA / ", nombrePaciente);
      octService(
        "./files/oct/masculopatia/mascuOD/" + numeroAlAzar(1, 6) + "od.pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OD_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
      octService(
        "./files/oct/masculopatia/mascuOS/" + numeroAlAzar(1, 6) + ".pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OS_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
    }
    //MASCULOPATIA OJO IZQUIERO
    else if (data.mascuOI == "x") {
      console.log("MASCU OI / ", nombrePaciente);
      octService(
        "./files/oct/" + numeroAlAzar(1, 5) + "od.pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OD_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
      octService(
        "./files/oct/masculopatia/mascuOS/" + numeroAlAzar(1, 6) + ".pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OS_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
    }
    //MASCULOPATIA OJO DERECHO
    else if (data.mascuOD == "x") {
      console.log("MASCU OD / ", nombrePaciente);
      octService(
        "./files/oct/masculopatia/mascuOD/" + numeroAlAzar(1, 3) + ".pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OD_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
      octService(
        "./files/oct/" + numeroAlAzar(1, 5) + "os.pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OS_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
    }
    //DESPRENDIMIENTO DE RETINA AMBOS OJOS
    else if (data.despOA == "x") {
      console.log("DESP OA / ", nombrePaciente);
      octService(
        "./files/oct/desprendimiento/despOD/" + numeroAlAzar(1, 2) + ".pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OD_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
      octService(
        "./files/oct/desprendimiento/despOS/" + numeroAlAzar(1, 2) + ".pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OS_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
    }
    //DESPRENDIMIENTO DE RETINA OJO IZQUIERDO
    else if (data.despOI == "x") {
      console.log("DESP OI / ", nombrePaciente);
      octService(
        "./files/oct/" + numeroAlAzar(1, 2) + "od.pdf",
        // "Alejandro_Gloria Nancy_14491124_19611017_Female_Macula Cube 512x32_20230612093800_OD_Macular Thickness Analysis_20230612124241.pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OD_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
      octService(
        "./files/oct/desprendimiento/despOS/" + numeroAlAzar(1, 2) + ".pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OS_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
    }
    //DESPRENDIMIENTO DE RETINA OJO DERECHO
    else if (data.despOD == "x") {
      console.log("DESP OD / ", nombrePaciente);
      octService(
        "./files/oct/desprendimiento/despOD/" + numeroAlAzar(1, 2) + ".pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OD_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
      octService(
        "./files/oct/" + numeroAlAzar(1, 5) + "os.pdf",
        // "Alejandro_Gloria Nancy_14491124_19611017_Female_Macula Cube 512x32_20230612093800_OD_Macular Thickness Analysis_20230612124241.pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OS_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
    }
    //OCT NORMAL
    else {
      console.log("NORMAL / ", nombrePaciente);
      octService(
        "./files/oct/" + numeroAlAzar(1, 5) + "od.pdf",
        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OD_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
      octService(
        "./files/oct/" + numeroAlAzar(1, 5) + "os.pdf",

        partesNombre +
          "_" +
          dniPaciente +
          "_" +
          fechaSinEspacios +
          "_" +
          genero +
          "_Macula Cube 512x32_" +
          fechaEstudioSinEspacios +
          "_OS_Macular Thickness Analysis_" +
          fechaEstudioSinEspacios +
          ".pdf",
        data
      );
    }
  }
}
