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

//FUNCION PARA CREAR EL PDF DE HRT
export async function hrtService(input, output, data) {
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

    //OBTENER NOMBRE DE EXCEL
    const nombrePaciente = data.Paciente.replace(/\n$/, "").trimEnd();
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const fechaNacimiento = data.FechaDeNacimiento;
    const fechaValidacion = data.FechaValidacion;
    const hora = data.Hora;
    let genero = data.genero;
    if (genero == "h") {
      genero = "Masculino";
    }
    if (genero == "m") {
      genero = "Femenino";
    }
    if (genero == undefined) {
      console.log("Falta completar genero de: ", nombrePaciente);
    }

    //NOMBRE
    firstPage.drawText(capitalizeFullName(nombrePaciente), {
      x: 106,
      y: 793,
      size: 11.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //DNI
    firstPage.drawText(dniPaciente.toString(), {
      x: 116,
      y: 747,
      size: 10.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //FECHA NACIMIENTO
    firstPage.drawText(fechaNacimiento.toString(), {
      x: 116,
      y: 762,
      size: 10.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //GENERO
    firstPage.drawText(genero, {
      x: 265,
      y: 762,
      size: 10.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //FECHA Y HORA 1
    const minutos1 = 13;
    firstPage.drawText(
      fechaValidacion.toString() + " / " + sumarMinutosAHorario(hora, minutos1),
      {
        x: 138,
        y: 650,
        size: 7.99,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      }
    );

    //   let fechaCambiada = cambiarFormatoFecha(fechaValidacion);
    //FECHA Y HORA 2
    // const minutos2 = 15;
    firstPage.drawText(
      fechaValidacion.toString() + " / " + "19:" + numeroAlAzar(10, 59),
      {
        x: 310,
        y: 64.5,
        size: 5.99,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      }
    );
    //FECHA Y HORA 3
    const minutos3 = 14;
    firstPage.drawText(
      fechaValidacion.toString() + " / " + sumarMinutosAHorario(hora, minutos3),

      {
        x: 400,
        y: 650,
        size: 7.99,
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
