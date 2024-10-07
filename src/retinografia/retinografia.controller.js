import { capitalizeFullName, numeroAlAzar } from "../../assets/tools.js";
import { retinografiaService } from "./retinografia.service.js";

export function retinografiaController(data) {
  function cambiarFormatoFecha(fecha) {
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
    var nuevaFecha = dia + "-" + mes + "-" + año;
    return nuevaFecha;
  }

  if (data.Retinografia == "x") {
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const fechaValidacion = data.FechaValidacion;
    const dateForTitle = cambiarFormatoFecha(fechaValidacion);
    if (data.OS == "x") {
      retinografiaService(
        "./files/retinografia/retinografiaOs/" + numeroAlAzar(1, 4) + ".pdf",
        capitalizeFullName(nombrePaciente) +
          "_RETINOGRAFIA_" +
          dateForTitle +
          ".pdf",
        data
      );
    } else {
      retinografiaService(
        "./files/retinografia/retinografia/" + numeroAlAzar(1, 6) + ".pdf",
        capitalizeFullName(nombrePaciente) + " RETINOGRAFIA" + ".pdf",
        data
      );
    }

    // const nombrePaciente = dataExcel[i].Paciente;
  }
}
