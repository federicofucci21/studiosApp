import { PDFDocument, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import {
  agregarPuntosDNI,
  capitalizeFullName,
  numeroAlAzar,
  quitarPuntosDNI,
  sumarMinutosAHorario,
} from "../../assets/tools.js";
import path from "path";
import fs from "fs";
import { rutaCarpeta } from "../../app.js";

//FUNCION PARA CREAR EL PDF DE RETINOGRAFIA
export async function retinografiaService(input, output, data) {
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
    if (genero === "h") {
      genero = "Masculino";
    }
    if (genero == "m") {
      genero = "Femenino";
    }
    if (genero == undefined) {
      console.log("Falta completar genero de: ", nombrePaciente);
    }

    const partesNombre = capitalizeFullName(nombrePaciente).split(" ");

    //FUNCION PARA MODIFICAR FORMATO DE FECHA (Año - Mes - Dia)
    function cambiarFormatoFechaNacimiento(fecha) {
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
      var nuevaFecha = año + "-" + mes + "-" + dia;
      // console.log("NUEVA FECHA", nuevaFecha);
      return nuevaFecha;
    }

    if (data.OS == "x") {
      //NOMBRE
      firstPage.drawText(nombrePaciente.toUpperCase(), {
        x: 120,
        y: 513,
        size: 16,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      });

      //DNI
      firstPage.drawText(dniPaciente.toString(), {
        x: 120,
        y: 532,
        size: 16,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      });

      //FECHA NACIMIENTO
      const newBirthDate = cambiarFormatoFechaNacimiento(fechaNacimiento);
      firstPage.drawText(newBirthDate.toString(), {
        x: 485,
        y: 532,
        size: 13,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      });

      //GENERO
      firstPage.drawText(genero, {
        x: 680,
        y: 532,
        size: 13,
        weight: 700,
        color: rgb(0, 0, 0),
        weight: 700,
        opacity: 1,
      });

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
        var nuevaFecha = año + "-" + mes + "-" + dia;
        // console.log("NUEVA FECHA", nuevaFecha);
        return nuevaFecha;
      }
      let fechaCambiada = cambiarFormatoFecha(fechaValidacion);

      //FECHA Y HORA 1
      const minutosTopo = 16;
      const minutosTopo2 = 17;
      const seconds = numeroAlAzar(10, 59);
      firstPage.drawText(
        fechaCambiada.toString() +
          " " +
          sumarMinutosAHorario(hora, minutosTopo) +
          ":" +
          seconds,
        {
          x: 685,
          y: 68,
          size: 10,
          weight: 700,
          color: rgb(0, 0, 0),
          weight: 700,
          opacity: 1,
        }
      );

      //FECHA Y HORA 2
      firstPage.drawText(
        fechaCambiada.toString() +
          " " +
          sumarMinutosAHorario(hora, minutosTopo2) +
          ":" +
          seconds,
        {
          x: 290,
          y: 68,
          size: 10,
          weight: 700,
          color: rgb(0, 0, 0),
          weight: 700,
          opacity: 1,
        }
      );
    } else {
      //NOMBRE
      firstPage.drawText(partesNombre[0] + ", " + partesNombre[1], {
        x: 212,
        y: 338,
        size: 26.99,
        weight: 700,
        color: rgb(0.22, 0.65, 0.77),
        opacity: 1,
      });

      const dni = agregarPuntosDNI(dniPaciente);

      //DNI
      firstPage.drawText(dni, {
        x: 146,
        y: 248,
        size: 26.99,
        weight: 700,
        color: rgb(0.22, 0.65, 0.77),
        opacity: 1,
      });

      function cambiarFormatoFechaEstudio(fecha) {
        var partesFechaEstudio = fecha.split("/");
        var fechaObjeto = new Date(
          partesFechaEstudio[2],
          partesFechaEstudio[1] - 1,
          partesFechaEstudio[0]
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
        var nuevaFecha = dia + "-" + mes + "-" + año;
        return nuevaFecha;
      }
      const fecha = cambiarFormatoFechaEstudio(fechaValidacion.toString());

      //FECHA VALIDACION
      firstPage.drawText(fecha, {
        x: 256,
        y: 84,
        size: 15.99,
        weight: 700,
        color: rgb(0.16, 0.49, 0.63),
        opacity: 1,
      });
    }

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
