import { PDFDocument, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import { capitalizeFullName } from "../../assets/tools.js";
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

    // Ruta de la carpeta nueva
    const rutaCarpeta2 = path.join(
      rutaCarpeta,
      capitalizeFullName(nombrePaciente)
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
