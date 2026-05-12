import { PDFDocument, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import {
  calcularEdadBarra,
  capitalizeFullName,
  numeroAlAzar,
  quitarPuntosDNI,
  sumarMinutosAHorario,
} from "../../assets/tools.js";
import path from "path";
import fs from "fs";
import { rutaCarpeta } from "../../app.js";
import { textHrt } from "../../assets/constants.js";
import fontkit from "@pdf-lib/fontkit";

//FUNCION PARA CREAR EL PDF DE HRT
export async function hrtService(
  input,
  output,
  data,
  minutosHrtD,
  minutosHrtI,
  ox,
) {
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
    pdfDoc.registerFontkit(fontkit);

    //OBTENER NOMBRE DE EXCEL
    const nombrePaciente = data.Paciente.replace(/\n$/, "").trimEnd();
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const fechaNacimiento = data.FechaDeNacimiento;
    const fechaValidacion = data.FechaValidacion;
    const tittle = data.tittle;
    const hora = data.Hora;
    const edad = calcularEdadBarra(fechaNacimiento);
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
    //CARGAR FUENTE
    const fontBytes = fs.readFileSync("./fonts/tahomabd.ttf");
    const customFont = await pdfDoc.embedFont(fontBytes);
    const color = rgb(0.13, 0.13, 0.13);
    const horaD =
      ox == "os"
        ? fechaValidacion.toString() + minutosHrtI
        : fechaValidacion.toString() + minutosHrtD;
    const horaI = ox
      ? ""
      : !ox
        ? fechaValidacion.toString() + minutosHrtI
        : "ERROR";
    // let typeOjo = ox == "os" ? "Izquierdo" : "od" ? "Derecho" : "Ambos";
    function ojoType(ox) {
      // console.log(ox);
      if (ox == "os") {
        return "Izquierdo";
      } else if (ox == "od") {
        return "Derecho";
      } else {
        return "Ambos";
      }
    }
    let typeOjo = ojoType(ox);

    if (data.SP == "x") {
      //NOMBRE
      firstPage.drawText(capitalizeFullName(nombrePaciente), {
        font: customFont,
        x: 55,
        y: 572,
        size: 9.83,
        weight: 800,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //DNI
      firstPage.drawText(dniPaciente.toString(), {
        font: customFont,
        x: 55,
        y: 558,
        size: 9.83,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //FECHA NACIMIENTO
      firstPage.drawText(fechaNacimiento.toString(), {
        font: customFont,
        x: 55,
        y: 544,
        size: 9.83,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      // EDAD
      firstPage.drawText(edad.toString(), {
        font: customFont,
        x: 55,
        y: 530,
        size: 9.83,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //GENERO
      firstPage.drawText(genero, {
        font: customFont,
        x: 260,
        y: 544,
        size: 9.83,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //OJO
      firstPage.drawText(typeOjo, {
        font: customFont,
        x: 260,
        y: 530,
        size: 9.83,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
      //FECHA DE VALIDACION
      firstPage.drawText(fechaValidacion, {
        font: customFont,
        x: 260,
        y: 558,
        size: 9.83,
        weight: 700,
        color: rgb(0, 0, 0),
        opacity: 1,
      });

      //FECHA Y HORA 1
      //const minutosTopo = ox === "os" ? 12 : 11;

      firstPage.drawText(horaD, {
        x: 60,
        y: 514,
        size: 9.08,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      });

      //FECHA Y HORA 2
      //console.log(horaI);
      firstPage.drawText(horaI, {
        x: 700,
        y: 514,
        size: 9.08,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      });
      if (data.ioma == "x") {
        //INFORME
        firstPage.drawText(textOct, {
          x: 65,
          y: 116,
          size: 7.99,
          weight: 700,
          color: rgb(0, 0, 0),
          weight: 700,
          opacity: 1,
          lineHeight: 12,
        });
      }
      //Dia de Impresion
      firstPage.drawText(fechaValidacion, {
        font: customFont,
        x: 662,
        y: 15,
        size: 4.62,
        weight: 500,
        color: rgb(0, 0, 0),
        opacity: 1,
      });
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
    //   firstPage.drawText(
    //     fechaValidacion.toString() + " / " + sumarMinutosAHorario(hora, minutos1),
    firstPage.drawText(horaD, {
      x: 138,
      y: 650,
      size: 7.99,
      weight: 700,
      color: rgb(0, 0, 0),
      weight: 700,
      opacity: 1,
    });

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
      },
    );
    //FECHA Y HORA 3
    // const minutos3 = 14;
    // firstPage.drawText(
    //   fechaValidacion.toString() + " / " + sumarMinutosAHorario(hora, minutos3),
    firstPage.drawText(
      horaI,

      {
        x: 400,
        y: 650,
        size: 7.99,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      },
    );
    if (data.ioma == "x") {
      //INFORME
      firstPage.drawText(textHrt, {
        x: 60,
        y: 110,
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
