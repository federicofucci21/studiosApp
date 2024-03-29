const { PDFDocument, rgb } = require("pdf-lib");
const { readFile } = require("fs/promises");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

// FUNCION PARA OBTENER EN FORMATO JSON LOS DATOS DEL EXCEL
function leerExcel(ruta) {
  const workBook = XLSX.readFile(ruta);
  const workBookSheets = workBook.SheetNames;
  // Especificar opciones de formato de celda
  const options = {
    cellDates: true, // Indicar que las fechas deben ser tratadas como objetos Date
  };
  const sheet = workBookSheets[0];
  const dataExcel = XLSX.utils.sheet_to_json(workBook.Sheets[sheet], options);
  return dataExcel;
}

//FUNCION PARA PASAR A MINUSCUAL EL NOMBRE Y MAYUSCULA LA PRIMER LETRA
function capitalizeFullName(fullName) {
  // Dividir el nombre completo en palabras individuales
  var words = fullName.split(" ");

  // Iterar sobre cada palabra y convertir la primera letra en mayúscula
  for (var i = 0; i < words.length; i++) {
    var word = words[i].toLowerCase(); // Convertir la palabra a minúsculas
    word = word.charAt(0).toUpperCase() + word.slice(1); // Convertir la primera letra en mayúscula
    words[i] = word; // Actualizar la palabra en el array
  }
  // Unir las palabras nuevamente en un solo string
  return words.join(" ");
}

//FUNCION PARA MODIFICAR FORMATO DE FECHA
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
  console.log("NUEVA FECHA", nuevaFecha);
  return nuevaFecha;
}

//FUNCION PARA QUITAR PUNTOS DEL DNI
function quitarPuntosDNI(dni) {
  // Utilizamos una expresión regular para encontrar y reemplazar los puntos en el DNI
  return dni.replace(/\./g, "");
}

// FUNCION PARA CREAR NUEVO PDF PAQUI
async function createAberrometriaPdf(input, output, i) {
  // console.log("INPUT", input);
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));
    // console.log("pfDoc", pdfDoc);

    //PRUEBA DE ESCRIBIR EN EL DOCUMENTO
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    //OBTENER NOMBRE DE EXCEL
    const dataExcel = leerExcel("baseDatos.xlsx");
    const nombrePaciente = dataExcel[i].Paciente;
    const dniPaciente = quitarPuntosDNI(dataExcel[i].DNI);
    const fechaNacimiento = dataExcel[i].FechaDeNacimiento;
    const fechaValidacion = dataExcel[i].FechaValidacion;
    const hora = dataExcel[i].Hora;
    let genero = dataExcel[i].genero;
    if (genero === "h") {
      genero = "M";
    } else {
      genero = "F";
    }
    console.log(dataExcel[i].Hora);

    //NOMBRE
    firstPage.drawText(nombrePaciente, {
      x: 100,
      y: 739,
      // font: customFont,
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
    console.log("nombre");

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

    function sumarMinutosAHorario(horario, minutosASumar) {
      // Convertir el horario a horas y minutos
      const [horas, minutos] = horario.split(":").map(Number);

      // Sumar los minutos
      const totalMinutos = horas * 60 + minutos + minutosASumar;

      // Calcular las nuevas horas y minutos
      const nuevasHoras = Math.floor(totalMinutos / 60);
      const nuevosMinutos = totalMinutos % 60;

      // Formatear el resultado en formato de hora (HH:MM)
      const horaFinal = `${nuevasHoras
        .toString()
        .padStart(2, "0")}:${nuevosMinutos.toString().padStart(2, "0")}`;

      return horaFinal;
    }

    //FECHA Y HORA 1
    const minutosTopo = 10;
    firstPage.drawText(
      fechaValidacion.toString() +
        " / " +
        sumarMinutosAHorario(hora, minutosTopo) +
        ":47",
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
      console.log("NUEVA FECHA", nuevaFecha);
      return nuevaFecha;
    }
    let fechaCambiada = cambiarFormatoFecha(fechaValidacion);
    //FECHA Y HORA 2

    firstPage.drawText(
      fechaCambiada.toString() +
        " / " +
        sumarMinutosAHorario(hora, minutosTopo) +
        ":05",
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
    const rutaCarpeta = path.join(
      __dirname,
      "estudiosTerminados",
      capitalizeFullName(nombrePaciente)
    );

    try {
      // Crea la carpeta nueva si no existe
      if (!fs.existsSync(rutaCarpeta)) {
        fs.mkdirSync(rutaCarpeta);
        console.log("Carpeta nueva creada:", rutaCarpeta);
      }

      // Ruta completa del archivo PDF
      const rutaArchivo = path.join(rutaCarpeta, output);

      // Guarda el documento PDF en la carpeta nueva
      fs.writeFileSync(rutaArchivo, await pdfDoc.save());
      console.log(`Documento PDF guardado en: ${rutaArchivo}`);
    } catch (error) {
      console.error("Error al guardar el documento PDF:", error);
    }
  } catch (error) {
    console.log(error);
  }
}

function funcionCompletaAberrometria() {
  // console.log("Hello World")
  const dataExcel = leerExcel("baseDatos.xlsx");
  // console.log(dataExcel)
  for (let i = 0; i < dataExcel.length; i++) {
    if (dataExcel[i].Aberrometria == "x") {
      const dataExcel = leerExcel("baseDatos.xlsx");
      const nombrePaciente = dataExcel[i].Paciente;
      const dniPaciente = quitarPuntosDNI(dataExcel[i].DNI);
      const fechaNacimiento = dataExcel[i].FechaDeNacimiento;
      const fechaValidacion = dataExcel[i].FechaValidacion;
      let genero = dataExcel[i].genero;
      if (genero === "h") {
        genero = "Hombre";
      } else {
        genero = "Mujer";
      }
      const partesNombre = nombrePaciente.split(" ");
      console.log("PARTEs", partesNombre);

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
        var nuevaFecha = dia + "-" + mes + "-" + año;
        console.log("NUEVA FECHA", nuevaFecha);
        return nuevaFecha;
      }

      const partesFechaNacimiento =
        cambiarFormatoFecha(fechaNacimiento).split("-");
      function numeroAlAzar(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

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
        console.log("NUEVA FECHA", nuevaFecha);
        return nuevaFecha;
      }
      const partesFechaEstudio =
        cambiarFormatoFechaEstudio(fechaValidacion).split("-");
      function numeroAlAzar(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      createAberrometriaPdf(
        "./aberrometria/" + numeroAlAzar(1, 10) + ".pdf",
        // "./aberrometria/10482941_ACTIS_HUGO____24_12_1952_OD_OS___30_10_2023__09_17___ZERNIKE.pdf",

        dniPaciente +
          "_" +
          partesNombre[0] +
          "_" +
          partesNombre[1] +
          "____" +
          partesFechaNacimiento[0] +
          "_" +
          partesFechaNacimiento[1] +
          "_" +
          partesFechaNacimiento[2] +
          "_OD_OS___" +
          partesFechaEstudio[0] +
          "_" +
          partesFechaEstudio[1] +
          "_" +
          partesFechaEstudio[2] +
          "___ZERNIKE.pdf",
        i
      );
    }
  }
}

funcionCompletaAberrometria();
