import { PDFDocument, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import {
  cambiarFormatoFecha,
  capitalizeFullName,
  numeroAlAzar,
  quitarPuntosDNI,
  sumarMinutosAHorario,
} from "../../assets/tools.js";
import path from "path";
import fs from "fs";
import { rutaCarpeta } from "../../app.js";
import { textTopografia } from "../../assets/constants.js";

//FUNCION PARA CREAR EL PDF DE TOPOGRAFIA

export async function topografiaService(input, output, data) {
  // console.log("INPUT", input);
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
    const tittle = data.tittle;
    const hora = data.Hora;
    let genero = data.genero;
    if (genero === "h") {
      genero = "M";
    }
    if (genero == "m") {
      genero = "F";
    }
    if (genero == undefined) {
      console.log("Falta completar genero de: ", nombrePaciente);
    }

    //NOMBRE
    firstPage.drawText(nombrePaciente, {
      x: 100,
      y: 739,
      size: 11.99,
      weight: 700,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

    //DNI
    firstPage.drawText(dniPaciente.toString(), {
      x: 100,
      y: 724,
      size: 12.99,
      weight: 700,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

    //FECHA NACIMIENTO
    firstPage.drawText(fechaNacimiento.toString(), {
      x: 100,
      y: 710,
      size: 12.99,
      weight: 700,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

    //GENERO
    firstPage.drawText(genero, {
      x: 385,
      y: 739,
      size: 12.99,
      weight: 700,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

    //FECHA Y HORA 1
    const minutosTopo = 9;
    const seconds = numeroAlAzar(10, 59);
    firstPage.drawText(
      fechaValidacion.toString() +
        " / " +
        sumarMinutosAHorario(hora, minutosTopo) +
        ":" +
        seconds,
      {
        x: 385,
        y: 724,
        size: 12.99,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      },
    );

    let newDate = cambiarFormatoFecha(fechaValidacion);
    //FECHA Y HORA 2

    firstPage.drawText(
      newDate.toString() +
        " / " +
        sumarMinutosAHorario(hora, minutosTopo) +
        ":" +
        numeroAlAzar(seconds, 59),
      {
        x: 120,
        y: 35,
        size: 7.69,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      },
    );

    if (data.ioma == "x") {
      //INFORME
      firstPage.drawText(textTopografia, {
        x: 30,
        y: 80,
        size: 7.99,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
        lineHeight: 12,
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
      }

      // Ruta completa del archivo PDF
      const rutaArchivo = path.join(rutaCarpeta2, output);

      // Guarda el documento PDF en la carpeta nueva
      fs.writeFileSync(rutaArchivo, await pdfDoc.save());
    } catch (error) {
      console.error("Error al guardar el documento PDF:", error);
    }
  } catch (error) {
    console.log(error);
  }
}
