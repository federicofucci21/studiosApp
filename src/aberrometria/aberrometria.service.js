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

//FUNCION PARA CREAR EL PDF DE ABERROMETRIA
export async function aberrometriaService(input, output, data) {
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
    const nombrePaciente = data.Paciente.replace(/\n$/, "");
    const dniPaciente = quitarPuntosDNI(data.DNI);
    const fechaNacimiento = data.FechaDeNacimiento;
    const fechaValidacion = data.FechaValidacion;
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
    const seconds = numeroAlAzar(10, 59);

    //FECHA Y HORA 1
    const minutosTopo = 10;
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
      }
    );

    function cambiarFormatoFecha(fecha) {
      var partesFecha = fecha.split("/");
      var fechaObjeto = new Date(
        partesFecha[2],
        partesFecha[1] - 1,
        partesFecha[0]
      );

      var dia = fechaObjeto.getDate();
      var mes = fechaObjeto.getMonth() + 1;
      var año = fechaObjeto.getFullYear();

      // Añadir ceros iniciales si es necesario
      if (dia < 10) {
        dia = "0" + dia;
      }
      if (mes < 10) {
        mes = "0" + mes;
      }

      // Construir la cadena con el nuevo formato
      var nuevaFecha = año + "/" + mes + "/" + dia;
      // console.log("NUEVA FECHA", nuevaFecha);
      return nuevaFecha;
    }
    let fechaCambiada = cambiarFormatoFecha(fechaValidacion);
    //FECHA Y HORA 2
    firstPage.drawText(
      fechaCambiada.toString() +
        " / " +
        sumarMinutosAHorario(hora, minutosTopo) +
        ":" +
        numeroAlAzar(seconds, 59),
      {
        x: 88,
        y: 29,
        size: 7.69,
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
