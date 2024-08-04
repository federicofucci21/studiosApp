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

// FUNCION PARA CALCULAR LA EDAD
function calcularEdad(fechaNacimiento) {
  var hoy = new Date();
  var fechaNacimiento = new Date(fechaNacimiento);
  var edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  var mes = hoy.getMonth() - fechaNacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }

  return edad;
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
  return nuevaFecha;
}

//FUNCION PARA QUITAR PUNTOS DEL DNI
function quitarPuntosDNI(dni) {
  // Utilizamos una expresión regular para encontrar y reemplazar los puntos en el DNI
  return dni.replace(/\./g, "");
}

// FUNCION PARA CREAR NUEVO PDF PAQUI
async function createIolPdf(input, output, i) {
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));
    //ESCRIBIR EN EL DOCUMENTO
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    //OBTENER NOMBRE DE EXCEL
    const dataExcel = leerExcel("baseDatos.xlsx");
    const nombrePaciente = dataExcel[i].Paciente.replace(/\n$/, "");
    const dniPaciente = quitarPuntosDNI(dataExcel[i].DNI);
    const fechaNacimiento = dataExcel[i].FechaDeNacimiento;
    const numAfiliado = dataExcel[i].Afiliado;
    const fechaValidacion = dataExcel[i].FechaValidacion;
    const iolOD = dataExcel[i].iolOD;
    const iolOI = dataExcel[i].iolOI;
    let genero = dataExcel[i].genero;
    if (genero === "h") {
      genero = "Hombre";
    } else {
      genero = "Mujer";
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
    firstPage.drawText("OD: " + iolOD.toString(), {
      x: 71,
      y: 599,
      size: 9.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    //OI
    firstPage.drawText("OI: " + iolOI.toString(), {
      x: 71,
      y: 579,
      size: 9.99,
      weight: 700,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

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
        // console.log("Carpeta nueva creada:", rutaCarpeta);
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

function funcionCompletaIol() {
  const dataExcel = leerExcel("baseDatos.xlsx");
  console.log(dataExcel);

  for (let i = 0; i < dataExcel.length; i++) {
    console.log(dataExcel[i].Paciente);
    // console.log(dataExcel[i].iolOD);
    if (dataExcel[i].iolOD === undefined || dataExcel[i].iolOI === undefined) {
      console.log(
        "PACIENTE: " +
          dataExcel[i].Paciente +
          " HAS DATA FOR THIS EXAM, CHECK WITH DOCTOR"
      );
    } else {
      if (dataExcel[i].IOL == "x") {
        const nombrePaciente = dataExcel[i].Paciente;
        const fechaValidacion = dataExcel[i].FechaValidacion;
        const dateForTitle = cambiarFormatoFecha(fechaValidacion);
        createIolPdf(
          "./modeloIol.pdf",
          capitalizeFullName(nombrePaciente) +
            "_IOL MASTER_" +
            dateForTitle +
            ".pdf",
          i
        );
      }
    }
  }
}
funcionCompletaIol();
