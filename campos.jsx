const { PDFDocument, rgb } = require("pdf-lib");
const { readFile } = require("fs/promises");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { type } = require("os");

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
  // console.log("NUEVA FECHA", nuevaFecha);
  return nuevaFecha;
}

//FUNCION PARA QUITAR PUNTOS DEL DNI
function quitarPuntosDNI(dni) {
  // console.log(typeof(dni));
dni = dni.toString();
// console.log(typeof(dni));
  if(dni === undefined || dni === null){
    return "ERROR DE DNI"
  }
  // Utilizamos una expresión regular para encontrar y reemplazar los puntos en el DNI
  return dni.replace(/\./g, "");
}

// FUNCION PARA CREAR NUEVO PDF PAQUI
async function createCamposPdf(input, output, i) {
  // console.log("INPUT", input);
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));
    // console.log("pfDoc", pdfDoc);

    //PRUEBA DE ESCRIBIR EN EL DOCUMENTO
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    //OBTENER NOMBRE DE EXCEL
    const dataExcel = leerExcel("baseDatos.xlsx");
    const nombrePaciente = dataExcel[i].Paciente.replace(/\n$/, "");
    const dniPaciente = quitarPuntosDNI(dataExcel[i].DNI);
    const fechaNacimiento = dataExcel[i].FechaDeNacimiento;
    const fechaValidacion = dataExcel[i].FechaValidacion;
    const hora = dataExcel[i].Hora;
    let genero = dataExcel[i].genero;
    console.log("1",genero)
    console.log("2",dataExcel[i])
    if (genero == "h") {
      genero = "Hombre";
    } if (genero === "m"){
      genero = "Mujer";
    } else {
      console.log(`Paciente ${nombrePaciente} no contiene datos sobre su genero`)
    }
    // console.log(dataExcel[i].Hora);
    // console.log("NOMBRE PACIENTE", capitalizeFullName(nombrePaciente));
    // console.log("FECHA NACIMIENTO", fechaNacimiento);

    //NOMBRE
    firstPage.drawText(
      capitalizeFullName(nombrePaciente) + ", " + fechaNacimiento,
      {
        x: 46,
        y: 526,
        // font: customFont,
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
    // console.log("nombre");

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
    const minutosOS = 5;
    firstPage.drawText(
      "Left eye (OS) / " +
        fechaValidacion.toString() +
        " / " +
        sumarMinutosAHorario(hora, minutosOS) +
        ":22",
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
        ":10",
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

function funcionCompletaCampos() {
  const dataExcel = leerExcel("baseDatos.xlsx");

  for (let i = 0; i < dataExcel.length; i++) {
    if (dataExcel[i].CampoVisual == "x") {
      const dataExcel = leerExcel("baseDatos.xlsx");

      // console.log("DATA", dataExcel[i]);
      const nombrePaciente = dataExcel[i].Paciente;
      const dniPaciente = quitarPuntosDNI(dataExcel[i].DNI);
      const fechaNacimiento = dataExcel[i].FechaDeNacimiento;
      let genero = dataExcel[i].Observaciones;
      if (genero == "h") {
        genero = "Hombre";
      } else {
        genero = "Mujer";
      }
      const partesNombre = capitalizeFullName(nombrePaciente).replace(
        / /g,
        "_"
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
        var nuevaFecha = año + "-" + mes + "-" + dia;
        // console.log("NUEVA FECHA", nuevaFecha);
        return nuevaFecha;
      }

      const partesFecha = cambiarFormatoFecha(fechaNacimiento).split("-");
      function numeroAlAzar(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      if (dataExcel[i].negroOD == "x") {
        createCamposPdf(
          "./campos/negros/negroOD/1.pdf",

          dniPaciente +
            "_" +
            partesNombre +
            "_" +
            partesFecha[0] +
            "_" +
            partesFecha[1] +
            "_" +
            partesFecha[2] +
            "_Both_eyes.pdf",
          i
        );
      }
      if (dataExcel[i].negroOI == "x") {
        createCamposPdf(
          "./campos/negros/negroOS/" + numeroAlAzar(1, 2) + ".pdf",

          dniPaciente +
            "_" +
            partesNombre +
            "_" +
            partesFecha[0] +
            "_" +
            partesFecha[1] +
            "_" +
            partesFecha[2] +
            "_Both_eyes.pdf",
          i
        );
      }
      if (dataExcel[i].negroOA == "x") {
        console.log("NEGRO", dataExcel[i]);
        createCamposPdf(
          "./campos/negros/negroOA/1.pdf",

          dniPaciente +
            "_" +
            partesNombre +
            "_" +
            partesFecha[0] +
            "_" +
            partesFecha[1] +
            "_" +
            partesFecha[2] +
            "_Both_eyes.pdf",
          i
        );
      }

      createCamposPdf(
        "./campos/" + numeroAlAzar(1, 6) + ".pdf",

        dniPaciente +
          "_" +
          partesNombre +
          "_" +
          partesFecha[0] +
          "_" +
          partesFecha[1] +
          "_" +
          partesFecha[2] +
          "_Both_eyes.pdf",
        i
      );
    }
  }
}

funcionCompletaCampos();

// if (dataExcel[i].negroOD == "x") {
//   createCamposPdf(
//     "./campos/negros/negroOD/1.pdf",

//     dniPaciente +
//       "_" +
//       partesNombre[0] +
//       "_" +
//       partesNombre[1] +
//       "_" +
//       partesFecha[0] +
//       "_" +
//       partesFecha[1] +
//       "_" +
//       partesFecha[2] +
//       "_Both_eyes.pdf",
//     i
//   );
// }
// if (dataExcel[i].negroOI == "x") {
//   createCamposPdf(
//     "./campos/negros/negroOS/" + numeroAlAzar(1, 2) + ".pdf",

//     dniPaciente +
//       "_" +
//       partesNombre[0] +
//       "_" +
//       partesNombre[1] +
//       "_" +
//       partesFecha[0] +
//       "_" +
//       partesFecha[1] +
//       "_" +
//       partesFecha[2] +
//       "_Both_eyes.pdf",
//     i
//   );
// }
// if (dataExcel[i].negroOA == "x") {
//   console.log("NEGRO", dataExcel[i]);
//   createCamposPdf(
//     "./campos/negros/negroOA/1.pdf",

//     dniPaciente +
//       "_" +
//       partesNombre[0] +
//       "_" +
//       partesNombre[1] +
//       "_" +
//       partesFecha[0] +
//       "_" +
//       partesFecha[1] +
//       "_" +
//       partesFecha[2] +
//       "_Both_eyes.pdf",
//     i
//   );
// }

// createCamposPdf(
//   "./campos/" + numeroAlAzar(1, 8) + ".pdf",

//   dniPaciente +
//     "_" +
//     partesNombre[0] +
//     "_" +
//     partesNombre[1] +
//     "_" +
//     partesFecha[0] +
//     "_" +
//     partesFecha[1] +
//     "_" +
//     partesFecha[2] +
//     "_Both_eyes.pdf",
//   i
// );
