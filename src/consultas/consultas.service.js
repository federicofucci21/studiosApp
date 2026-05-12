import { PDFDocument, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import {
  AVMCValue,
  AVSCValue,
  capitalizeFullName,
  numeroAlAzar,
  quitarPuntosDNI,
} from "../../assets/tools.js";
import path from "path";
import fs from "fs";
import { rutaCarpeta } from "../../app.js";

import fontkit from "@pdf-lib/fontkit";

//FUNCION PARA CREAR EL PDF DE CONSULTAS
export async function consultasService(input, output, data) {
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));
    if (!pdfDoc) {
      throw new Error("No se pudo cargar el PDF");
    }

    pdfDoc.registerFontkit(fontkit);

    //PRUEBA DE ESCRIBIR EN EL DOCUMENTO
    const pages = pdfDoc.getPages();
    if (pages.length === 0) {
      throw new Error("El PDF no tiene páginas");
    }
    const firstPage = pages[0];

    //OBTENER NOMBRE DE EXCEL
    const nombrePaciente = data.Paciente.replace(/\n$/, "").trimEnd();
    const numAfiliado = data.Afiliado;
    const fechaValidacion = data.FechaValidacion;
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const tittle = data.tittle;
    const fechaNacimiento = data.FechaDeNacimiento;
    let paquiOD = data.paquiOD;
    let paquiOI = data.paquiOI;
    let microOD = data.microOD;
    let microOI = data.microOI;
    const obraSocial = "PAMI";
    const consulta = data.consulta;
    let AVSCD = data.AVSCD;
    let AVSCI = data.AVSCI;
    let AVMCD = data.AVMCD;
    let AVMCI = data.AVMCI;
    let presionD = data.presionD;
    let presionI = data.presionI;

    if (paquiOD === undefined || paquiOI === undefined) {
      paquiOD = numeroAlAzar(500, 570);
      paquiOI = numeroAlAzar(500, 570);
    }

    if (microOD === undefined || microOI === undefined) {
      microOD = numeroAlAzar(2200, 2600);
      microOI = numeroAlAzar(2200, 2600);
    }
    if (AVSCD === undefined || AVSCI === undefined) {
      AVSCD = AVSCValue();
      AVSCI = AVSCValue();
    }
    if (AVMCD === undefined || AVMCI === undefined) {
      AVMCD = AVMCValue();
      AVMCI = AVMCValue();
    }
    if (presionD === undefined || presionI === undefined) {
      let presionValue = numeroAlAzar(12, 18) + " mmg";
      presionD = presionValue;
      presionI = presionValue;
    }
    if (consulta == 4) {
      //NOMBRE
      if (consulta == !4)
        firstPage.drawText(capitalizeFullName(nombrePaciente), {
          x: 72,
          y: 712,
          size: 11.99,
          weight: 700,
          color: rgb(0, 0, 0),
          opacity: 1,
        });
      if (consulta == 4)
        firstPage.drawText(capitalizeFullName(nombrePaciente), {
          x: 212,
          y: 715,
          size: 11.99,
          weight: 700,
          color: rgb(0, 0, 0),
          opacity: 1,
        });

      //NUMERO AFILIADO
      if (consulta === "4") {
        firstPage.drawText(numAfiliado, {
          x: 212,
          y: 614.8,
          size: 10.99,
          weight: 700,
          color: rgb(0, 0, 0),
          opacity: 1,
        });
      } else if (consulta == !4) {
        firstPage.drawText("PAMI " + numAfiliado, {
          x: 72,
          y: 695,
          size: 10.99,
          weight: 700,
          color: rgb(0, 0, 0),
          opacity: 1,
        });
      }

      //FECHA VALIDACION
      if (consulta == !4) {
        firstPage.drawText(fechaValidacion.toString(), {
          x: 72,
          y: 651,
          size: 10.99,
          weight: 700,
          color: rgb(0, 0, 0),
          opacity: 1,
        });
      }

      //FECHA NACIMIENTO
      firstPage.drawText(fechaNacimiento.toString(), {
        x: 219,
        y: 689.8,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //DNI
      firstPage.drawText(dniPaciente.toString(), {
        x: 111,
        y: 665.2,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //PAQUI OD
      firstPage.drawText(paquiOD.toString(), {
        x: 108,
        y: 246,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //PAQUI OI
      firstPage.drawText(paquiOI.toString(), {
        x: 108,
        y: 221,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //MICRO OD
      firstPage.drawText(microOD.toString(), {
        x: 108,
        y: 171.5,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //MICRO OI
      firstPage.drawText(microOI.toString(), {
        x: 108,
        y: 146.5,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //OBRA SOCIAL
      firstPage.drawText(obraSocial.toString(), {
        x: 166,
        y: 640.5,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //AGUDEZA VISUAL SIN CORREGIR D
      firstPage.drawText(AVSCD.toString(), {
        x: 108,
        y: 470.5,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //AGUDEZA VISUAL SIN CORREGIR I
      firstPage.drawText(AVSCI.toString(), {
        x: 108,
        y: 446.5,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //AGUDEZA VISUAL MEJOR CORREGIDA D
      firstPage.drawText(AVMCD.toString(), {
        x: 108,
        y: 396.5,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //AGUDEZA VISUAL MEJOR CORREGIDA I
      firstPage.drawText(AVMCI.toString(), {
        x: 108,
        y: 372.5,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //PRESION INTRA OCULAR D
      firstPage.drawText(presionD.toString(), {
        x: 108,
        y: 321,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //PRESION INTRA OCULAR I
      firstPage.drawText(presionI.toString(), {
        x: 108,
        y: 297,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
    }
    if (consulta == 1 || consulta == 2 || consulta == 3) {
      //NOMBRE
      firstPage.drawText(capitalizeFullName(nombrePaciente), {
        x: 72,
        y: 712,
        size: 11.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });

      //NUMERO AFILIADO
      firstPage.drawText("PAMI " + numAfiliado, {
        x: 72,
        y: 695,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });

      //FECHA VALIDACION
      firstPage.drawText(fechaValidacion.toString(), {
        x: 72,
        y: 671,
        size: 10.99,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
    }

    // Ruta de la carpeta nueva
    const rutaCarpeta2 = path.join(
      rutaCarpeta,
      tittle,
      capitalizeFullName(nombrePaciente),
    );

    try {
      // Crea la carpeta nueva si no existe
      if (!fs.existsSync(rutaCarpeta2)) {
        fs.mkdirSync(rutaCarpeta2, { recursive: true });
        // console.log("Carpeta nueva creada:", rutaCarpeta2);
      }

      // Ruta completa del archivo PDF
      const rutaArchivo = path.join(rutaCarpeta2, output);

      // Guarda el documento PDF en la carpeta nueva
      fs.writeFileSync(rutaArchivo, await pdfDoc.save());
      // console.log(`Documento PDF guardado en: ${rutaArchivo}`);
    } catch (error) {
      console.error("Error al guardar el documento PDF:", error);
    }
  } catch (error) {
    console.log(error);
  }
}
