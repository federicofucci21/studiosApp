import {
  cambiarFormatoFechaGuion,
  capitalizeFullName,
  numeroAlAzar,
} from "../../assets/tools.js";
import { lotmarService } from "./lotmar.service.js";

export function lotmarController(data) {
  let Lotmar = "";
  if (data.Lotmar == "x" || data.Lotmar == "X") {
    Lotmar = data.Lotmar.toLowerCase();
  } else {
    Lotmar = "a";
  }
  if (Lotmar == "x") {
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const fechaValidacion = data.FechaValidacion;
    const dateForTitle = cambiarFormatoFechaGuion(fechaValidacion);
    if (!data.lotmarOD || !data.lotmarOI) {
      let arrayOD = ["20/20", "20/40", "20/400"];
      let arrayOI = ["20/20", "20/80", "20/800"];
      let position = numeroAlAzar(0, 2);
      data.lotmarOD = arrayOD[position];
      data.lotmarOI = arrayOI[position];
      lotmarService(
        "./files/lotmar/modeloLotmar.pdf",
        capitalizeFullName(nombrePaciente) + "_LOTMAR_" + dateForTitle + ".pdf",
        data
      );
    } else {
      lotmarService(
        "./files/lotmar/modeloLotmar.pdf",
        capitalizeFullName(nombrePaciente) + "_LOTMAR_" + dateForTitle + ".pdf",
        data
      );
    }
  }

  // if (data.Lotmar) {
  //   Lotmar = data.Lotmar.toLowerCase();
  // }
  // // else {
  // //   Lotmar = "a";
  // // }
  // if (
  //   (Lotmar === "x" && data.lotmarOD === undefined) ||
  //   data.lotmarOI === undefined
  // ) {
  //   let arrayOD = ["20/20", "20/40", "20/400"];
  //   let arrayOI = ["20/20", "20/80", "20/800"];
  //   let position = numeroAlAzar(1, 3);
  //   data.lotmarOD = arrayOD[position];
  //   data.lotmarOI = arrayOI[position];
  //   const nombrePaciente = data.Paciente.replace(/\n$/, "");
  //   const fechaValidacion = data.FechaValidacion;
  //   const dateForTitle = cambiarFormatoFechaGuion(fechaValidacion);
  //   lotmarService(
  //     "./files/lotmar/modeloLotmar.pdf",
  //     capitalizeFullName(nombrePaciente) + "_LOTMAR_" + dateForTitle + ".pdf",
  //     data
  //   );
  // } else {
  //   if (Lotmar == "x") {
  //     const nombrePaciente = data.Paciente.replace(/\n$/, "");
  //     const fechaValidacion = data.FechaValidacion;
  //     const dateForTitle = cambiarFormatoFechaGuion(fechaValidacion);
  //     lotmarService(
  //       "./files/lotmar/modeloLotmar.pdf",
  //       capitalizeFullName(nombrePaciente) + "_LOTMAR_" + dateForTitle + ".pdf",
  //       data
  //     );
  //   }
  // }
}
