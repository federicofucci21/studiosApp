import {
  cambiarFormatoFecha,
  capitalizeFullName,
  numeroAlAzar,
  quitarPuntosDNI,
  sumarMinutosAHorario,
} from "../../assets/tools.js";
import { octService } from "./oct.service.js";

export function octController(data) {
  let OCT = "";

  if (data.OCT) {
    OCT = data.OCT.toLowerCase();
  } else {
    OCT = "a";
  }
  if (OCT == "x") {
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
      // console.log(fecha);
      var partesFecha = fecha.split("/");
      // console.log(partesFecha);
      var fechaObjeto = new Date(
        partesFecha[2],
        partesFecha[1] - 1,
        partesFecha[0],
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
      // console.log(nuevaFecha);
      return nuevaFecha;
    }
    // console.log(fechaNacimiento);
    const fechaSinEspacios = cambiarFormatoFechaJunta(fechaNacimiento);
    // console.log(fechaSinEspacios);
    const fechaEstudioSinEspacios = cambiarFormatoFechaJunta(fechaValidacion);

    const minutosTopoD =
      " " + sumarMinutosAHorario(hora, 12) + ":" + numeroAlAzar(10, 59);
    const minutosTopoI =
      " " + sumarMinutosAHorario(hora, 11) + ":" + numeroAlAzar(10, 59);
    const horaTittle = minutosTopoD.toString().replace(/:/g, "");
    const horaTittleI = minutosTopoI.toString().replace(/:/g, "");

    let file = "";
    let fileD = "";
    let fileI = "";

    //OCT MASCULOPATIA OJO DERECHO SAN PEDRO
    if (data.SP == "x" && data.mascuOD == "x") {
      // console.log("MASCU DER");
      //OJO DERECHO
      octService(
        "./files/oct/SP/OD/masculopatia/" + "1" + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
        data,
        minutosTopoD,
        minutosTopoI,
        "od",
      );
      // //OJO IZQUIERDO
      // octService(
      //   "./files/oct/SP/OI/" + "1" + ".pdf",
      //   dniPaciente +
      //     "_" +
      //     partesNombre +
      //     "_" +
      //     fechaSinEspacios +
      //     "_" +
      //     horaTittleI +
      //     "_" +
      //     "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
      //   data,
      //   minutosTopoD,
      //   minutosTopoI,
      //   "os",
      // );
    }
    //OCT MASCULOPATIA OJO IZQUIERDO SAN PEDRO
    else if (data.SP == "x" && data.mascuOI == "x") {
      //OJO DERECHO
      // octService(
      //   "./files/oct/SP/OD/" + "1" + ".pdf",
      //   dniPaciente +
      //     "_" +
      //     partesNombre +
      //     "_" +
      //     fechaSinEspacios +
      //     "_" +
      //     horaTittle +
      //     "_" +
      //     "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
      //   data,
      //   minutosTopoD,
      //   minutosTopoI,
      //   "os",
      // );
      //OJO IZQUIERDO
      octService(
        "./files/oct/SP/OI/masculopatia/" + "1" + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }
    //OCT DESPRENDIMIENTO AMBOS OJOS SAN PEDRO
    else if (data.SP == "x" && data.despOA == "x") {
      //OJO DERECHO
      octService(
        "./files/oct/SP/OD/desprendimiento/" + "1" + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
        data,
        minutosTopoD,
        minutosTopoI,
        "od",
      );
      //OJO IZQUIERDO
      octService(
        "./files/oct/SP/OI/desprendimiento/" + "1" + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittleI +
          "_" +
          "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }
    //OCT MASCULOPATIA AMBOS OJOS SAN PEDRO
    else if (data.SP == "x" && data.mascuOA == "x") {
      //OJO DERECHO
      octService(
        "./files/oct/SP/OD/masculopatia/" + "1" + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
        data,
        minutosTopoD,
        minutosTopoI,
        "od",
      );
      //OJO IZQUIERDO
      octService(
        "./files/oct/SP/OI/masculopatia/" + "1" + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }
    //OCT DESPRENDIMIENTO OJO DERECHO SAN PEDRO
    else if (data.SP == "x" && data.despOD == "x") {
      //OJO DERECHO
      octService(
        "./files/oct/SP/OD/desprendimiento/" + numeroAlAzar(1, 2) + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
        data,
        minutosTopoD,
        minutosTopoI,
        "od",
      );
      //OJO IZQUIERDO
      // octService(
      //   "./files/oct/SP/OI/" + "1" + ".pdf",
      //   dniPaciente +
      //     "_" +
      //     partesNombre +
      //     "_" +
      //     fechaSinEspacios +
      //     "_" +
      //     horaTittle +
      //     "_" +
      //     "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
      //   data,
      //   minutosTopoD,
      //   minutosTopoI,
      // );
    }
    //OCT DESPRENDIMIENTO OJO IZQUIERDO SAN PEDRO
    else if (data.SP == "x" && data.despOI == "x") {
      // //OJO DERECHO
      // octService(
      //   "./files/oct/SP/OD/" + "1" + ".pdf",
      //   dniPaciente +
      //     "_" +
      //     partesNombre +
      //     "_" +
      //     fechaSinEspacios +
      //     "_" +
      //     horaTittle +
      //     "_" +
      //     "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
      //   data,
      //   minutosTopoD,
      //   minutosTopoI,
      //   "os",
      // );
      //OJO IZQUIERDO
      octService(
        "./files/oct/SP/OI/desprendimiento/" + "1" + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }
    //OCT NORMAL OJO IZQUIERDO SAN PEDRO
    else if (data.SP == "x" && data.OI == "x") {
      //OJO IZQUIERDO
      octService(
        "./files/oct/SP/OI/" + numeroAlAzar(1, 2) + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }
    //OCT NORMAL OJO DERECHO SAN PEDRO
    else if (data.SP == "x" && data.OD == "x") {
      //OJO DERECHO
      octService(
        "./files/oct/SP/OD/" + "1" + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Retina_Radial_R_SIMPLE_12mm_1024x12x5.pdf",
        data,
        minutosTopoD,
        minutosTopoI,
        "od",
      );
    }
    //OCT NORMAL SAN PEDRO
    else if (data.SP == "x") {
      //AMBOS OJOS
      //numeroAlAzar(1, 10)
      octService(
        "./files/oct/SP/" + numeroAlAzar(1, 10) + ".pdf",
        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          fechaSinEspacios +
          "_" +
          horaTittle +
          "_" +
          "Retina_Radial_AMBOS_OJOS_12mm_1024x12x5.pdf",
        data,
        minutosTopoD,
        minutosTopoI,
      );
    }
    //MASCULOPATIA AMBOS OJOS
    else if (data.mascuOA == "x") {
      // console.log("MASCU OA / ", nombrePaciente);
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
        data,
        minutosTopoD,
        minutosTopoI,
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
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }
    //MASCULOPATIA OJO DERECHO
    else if (data.mascuOD == "x") {
      // console.log("MASCU OD / ", nombrePaciente);
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
        data,
        minutosTopoD,
        minutosTopoI,
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
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }
    //MASCULOPATIA OJO IZQUIERO
    else if (data.mascuOI == "x") {
      // console.log("MASCU OI / ", nombrePaciente);
      octService(
        "./files/oct/" + numeroAlAzar(1, 5) + ".pdf",

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
        data,
        minutosTopoD,
        minutosTopoI,
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
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }
    //DESPRENDIMIENTO DE RETINA AMBOS OJOS
    else if (data.despOA == "x") {
      // console.log("DESP OA / ", nombrePaciente);
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
        data,
        minutosTopoD,
        minutosTopoI,
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
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }
    //DESPRENDIMIENTO DE RETINA OJO IZQUIERDO
    else if (data.despOI == "x") {
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
        data,
        minutosTopoD,
        minutosTopoI,
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
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }
    //DESPRENDIMIENTO DE RETINA OJO DERECHO
    else if (data.despOD == "x") {
      // console.log("DESP OD / ", nombrePaciente);
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
        data,
        minutosTopoD,
        minutosTopoI,
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
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }

    //OCT NORMAL
    else {
      //console.log("ESTOY ALLA");
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
        data,
        minutosTopoD,
        minutosTopoI,
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
        data,
        minutosTopoD,
        minutosTopoI,
        "os",
      );
    }
  }
}
