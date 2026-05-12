import { PDFDocument, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import {
  cambiarFormatoFecha,
  capitalizeFullName,
  numeroAlAzar,
  quitarPuntosDNI,
  sumarMinutosAHorario,
  calcularEdad,
  calcularEdadBarra,
} from "../../assets/tools.js";
import path from "path";
import fs from "fs";
import { rutaCarpeta } from "../../app.js";

import fontkit from "@pdf-lib/fontkit";
//FUNCION PARA CREAR EL PDF DE ANGIOGRAFIA

export async function angiografiaService(input, output, data) {
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

    //OBTENER DATOS DEl EXCEL
    const nombrePaciente = data.Paciente.replace(/\n$/, "").trimEnd();
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const fechaNacimiento = data.FechaDeNacimiento;
    const fechaValidacion = data.FechaValidacion;
    const tittle = data.tittle;
    const hora = data.Hora;
    let genero = data.genero;
    if (genero === "h") {
      genero = "Masculino";
    }
    if (genero == "m") {
      genero = "Femenino";
    }
    if (genero == undefined) {
      console.log("Falta completar genero de: ", nombrePaciente);
    }
    const edadPaciente = calcularEdadBarra(fechaNacimiento).toString();
    const ojo = "Ambos";
    //CARGAR FUENTE
    const fontBytes = fs.readFileSync("./fonts/tahomabd.ttf");
    const customFont = await pdfDoc.embedFont(fontBytes);

    //NOMBRE
    firstPage.drawText(nombrePaciente, {
      font: customFont,
      x: 57,
      y: 571,
      size: 9.93,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //DNI
    firstPage.drawText(dniPaciente.toString(), {
      font: customFont,
      x: 57,
      y: 557,
      size: 9.93,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //FECHA NACIMIENTO
    firstPage.drawText(fechaNacimiento.toString(), {
      font: customFont,
      x: 57,
      y: 543,
      size: 9.93,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

    //EDAD
    firstPage.drawText(edadPaciente, {
      font: customFont,
      x: 57,
      y: 530,
      size: 9.93,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

    //FECHA ESTUDIO
    firstPage.drawText(fechaValidacion.toString(), {
      font: customFont,
      x: 260,
      y: 557,
      size: 9.93,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

    //GENERO
    firstPage.drawText(genero, {
      font: customFont,
      x: 260,
      y: 543,
      size: 9.93,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

    //FECHA Y HORA 1
    const minutos1 = 15;
    const minutos2 = 16;
    const seconds = numeroAlAzar(10, 59);
    firstPage.drawText(
      fechaValidacion.toString() +
        " " +
        sumarMinutosAHorario(hora, minutos1) +
        ":" +
        seconds,
      {
        x: 695,
        y: 514,
        size: 9,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      }
    );

    //FECHA Y HORA 2

    firstPage.drawText(
      fechaValidacion.toString() +
        " " +
        sumarMinutosAHorario(hora, minutos2) +
        ":" +
        seconds,
      {
        x: 58,
        y: 514,
        size: 9,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      }
    );

    //OJO
    firstPage.drawText(ojo, {
      font: customFont,
      x: 260,
      y: 530,
      size: 9.93,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

    //FECHA DE IMPRESION
    firstPage.drawText(fechaValidacion, {
      // font: customFont,
      x: 683,
      y: 21,
      size: 4.93,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

    // Ruta de la carpeta nueva
    const rutaCarpeta2 = path.join(
      rutaCarpeta,
      tittle,
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
