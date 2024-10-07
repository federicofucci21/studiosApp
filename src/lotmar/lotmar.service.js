import { PDFDocument, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import {
  calcularEdad,
  cambiarFormatoFecha,
  capitalizeFullName,
  quitarPuntosDNI,
} from "../../assets/tools.js";
import path from "path";
import fs from "fs";
import { rutaCarpeta } from "../../app.js";

import fontkit from "@pdf-lib/fontkit";

//FUNCION PARA CREAR EL PDF DE LOTMAR
export async function lotmarService(input, output, data) {
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
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const fechaNacimiento = data.FechaDeNacimiento;
    const numAfiliado = data.Afiliado;
    const fechaValidacion = data.FechaValidacion;
    const paquiOD = data.lotmarOD;
    const paquiOI = data.lotmarOI;
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
    // OBTENER EDAD DEL PACIENTE
    const nuevaFecha = cambiarFormatoFecha(fechaNacimiento);
    const edadPaciente = calcularEdad(nuevaFecha);

    //NOMBRE
    firstPage.drawText(capitalizeFullName(nombrePaciente), {
      x: 72,
      y: 712,
      size: 11.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //DNI
    firstPage.drawText("DNI " + dniPaciente.toString(), {
      x: 72,
      y: 697,
      size: 10.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //EDAD y GENERO
    firstPage.drawText(edadPaciente + " años " + genero, {
      x: 72,
      y: 683,
      size: 10.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //NUMERO AFILIADO
    firstPage.drawText("PAMI " + numAfiliado, {
      x: 72,
      y: 669,
      size: 10.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //FECHA VALIDACION
    firstPage.drawText(fechaValidacion.toString(), {
      x: 71,
      y: 641,
      size: 10.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //OD
    firstPage.drawText("OD: " + paquiOD.toString(), {
      x: 71,
      y: 599,
      size: 9.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //OI
    firstPage.drawText("OI: " + paquiOI.toString(), {
      x: 71,
      y: 579,
      size: 9.99,
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
