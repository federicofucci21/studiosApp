import { folderTittle, leerExcel } from "./assets/tools.js";
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
}

function buclePLay(data) {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].Paciente == undefined) {
      // console.log("NO PACIENT");
    } else {
      count = count + 1;
      Play(data[i]);
    }
  }
  console.log("COUNT: ", count);
}

buclePLay(data);
