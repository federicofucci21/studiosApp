import {
  AVMCValue,
  AVSCValue,
  leerExcel,
  numeroAlAzar,
} from "./assets/tools.js";
import camposController from "./src/campos/campos.controller.js";
import path from "path";
import { fileURLToPath } from "url";
import { topografiaController } from "./src/topografia/topografia.controller.js";
import { aberrometriaController } from "./src/aberrometria/aberrometria.controller.js";
import { octController } from "./src/oct/oct.controller.js";
import { hrtController } from "./src/hrt/hrt.controller.js";
import { retinografiaController } from "./src/retinografia/retinografia.controller.js";
import { iolController } from "./src/iol/iol.controller.js";
import { paquiController } from "./src/paqui/paqui.controller.js";
import { lotmarController } from "./src/lotmar/lotmar.controller.js";
import { consultasController } from "./src/consultas/consultas.controller.js";
import { angiografiaController } from "./src/angiografia/angiografia.controller.js";
import { microController } from "./src/microscopia/micro.controller.js";

const data = leerExcel("baseDatos.xlsx");
// Ruta de la carpeta nueva
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const rutaCarpeta = path.join(__dirname, "estudiosTerminados");
// export const rutaCarpeta = path.join(__dirname, folderTittle(data));

function Play(data) {
  camposController(data);
  topografiaController(data);
  aberrometriaController(data);
  octController(data);
  hrtController(data);
  retinografiaController(data);
  iolController(data);
  paquiController(data);
  lotmarController(data);
  consultasController(data);
  angiografiaController(data);
  microController(data);
}

function buclePLay(data) {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].Paciente == undefined) {
      // console.log("NO PACIENT");
    } else {
      if (data[i].Paciente !== "0" && !data[i].consulta) {
        count = count + 1;
      }
      // console.log(typeof data[i].Paciente);
      //Completamos datos vacios para HC
      if (data[i].paquiOD === undefined || data[i].paquiOI === undefined) {
        data[i].paquiOD = numeroAlAzar(500, 570);
        data[i].paquiOI = numeroAlAzar(500, 570);
      }

      if (data[i].microOD === undefined || data[i].microOI === undefined) {
        data[i].microOD = numeroAlAzar(2200, 2600);
        data[i].microOI = numeroAlAzar(2200, 2600);
      }
      if (data[i].AVSCD === undefined || data[i].AVSCI === undefined) {
        data[i].AVSCD = AVSCValue();
        data[i].AVSCI = AVSCValue();
      }
      if (data[i].AVMCD === undefined || data[i].AVMCI === undefined) {
        data[i].AVMCD = AVMCValue();
        data[i].AVMCI = AVMCValue();
      }
      if (data[i].presionD === undefined || data[i].presionI === undefined) {
        let presionValue = numeroAlAzar(12, 18) + " mmg";
        data[i].presionD = presionValue;
        data[i].presionI = presionValue;
      }

      Play(data[i]);
    }
  }
  console.log("Love Beatles!");
  // console.log("COUNT: ", count);
}

buclePLay(data);
