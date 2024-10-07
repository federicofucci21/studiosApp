import { PDFDocument, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import {
  capitalizeFullName,
  numeroAlAzar,
  quitarPuntosDNI,
  sumarMinutosAHorario,
} from "../../assets/tools.js";
import path from "path";
import fs from "fs";
import { rutaCarpeta } from "../../app.js";

//FUNCION PARA CREAR EL PDF DE CAMPIMETRIA
export async function camposService(input, output, data) {
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));
    if (!pdfDoc) {
      throw new Error("No se pudo cargar el PDF");
    }

    //PRUEBA DE ESCRIBIR EN EL DOCUMENTO
    const pages = pdfDoc.getPages();
    if (pages.length === 0) {
      throw new Error("El PDF no tiene páginas");
    }
    const firstPage = pages[0];

    //OBTENER DATOS DEl EXCEL
    const nombrePaciente = data.Paciente.replace(/\n$/, "").trimEnd();
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const fechaNacimiento = data.FechaDeNacimiento;
    const fechaValidacion = data.FechaValidacion;
    const hora = data.Hora;
    let genero = data.genero;
    if (genero == "h") {
      genero = "Hombre";
    }
    if (genero == "m") {
      genero = "Mujer";
    }
    if (genero === undefined) {
      console.log("Falta completar genero de: ", nombrePaciente);
    }

    //NOMBRE
    firstPage.drawText(
      capitalizeFullName(nombrePaciente) + ", " + fechaNacimiento,
      {
        x: 46,
        y: 526,
        size: 13.99,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      }
    );

    //DNI
    firstPage.drawText("ID " + dniPaciente.toString(), {
      x: 46,
      y: 514,
      size: 8.99,
      weight: 700,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

    //FECHA Y HORA 1
    const minutosOS = 5;
    firstPage.drawText(
      "Left eye (OS) / " +
        fechaValidacion.toString() +
        " / " +
        sumarMinutosAHorario(hora, minutosOS) +
        ":" +
        numeroAlAzar(10, 59),
      {
        x: 46,
        y: 479,
        size: 8.99,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      }
    );

    //FECHA Y HORA 2
    const minutosOD = 1;
    firstPage.drawText(
      "Right eye (OD) / " +
        fechaValidacion.toString() +
        " / " +
        sumarMinutosAHorario(hora, minutosOD) +
        ":" +
        numeroAlAzar(10, 59),
      {
        x: 416,
        y: 479,
        size: 8.99,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      }
    );

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
