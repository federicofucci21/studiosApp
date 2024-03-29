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

function agregarPuntosDNI(dni) {
  // Convertir el número de DNI a string para facilitar la manipulación
  dni = dni.toString();
  console.log(dni);

  // Verificar que el número de DNI tenga al menos 7 dígitos
  if (dni.length < 7) {
    return "El número de DNI debe tener al menos 7 dígitos.";
  }
  if (dni.length == 7) {

    // Agregar puntos según el formato estándar
    var dniConPuntos =
    dni.substring(0, 1) + "." + dni.substring(1, 4) + "." + dni.substring(4);
    console.log(dniConPuntos);
    return dniConPuntos;
  }
  if (dni.length == 8) {

    // Agregar puntos según el formato estándar
    var dniConPuntos =
    dni.substring(0, 2) + "."+ dni.substring(2, 5) + "." + dni.substring(5);
      // dni.substring(0) + "." + dni.substring(1, 3) + "." + dni.substring(4);
      console.log(dniConPuntos);
    return dniConPuntos;
  }
}

//FUNCION PARA QUITAR PUNTOS DEL DNI
function quitarPuntosDNI(dni) {
  // Utilizamos una expresión regular para encontrar y reemplazar los puntos en el DNI
  return dni.replace(/\./g, "");

}

// FUNCION PARA CREAR NUEVO PDF PAQUI
async function createRetinografiaPdf(input, output, i) {
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));

    //PRUEBA DE ESCRIBIR EN EL DOCUMENTO
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    //OBTENER NOMBRE DE EXCEL
    const dataExcel = leerExcel("baseDatos.xlsx");
    const nombrePaciente = dataExcel[i].Paciente;
    const dniPaciente = quitarPuntosDNI(dataExcel[i].DNI).toString();
    const fechaValidacion = dataExcel[i].FechaValidacion;

    const partesNombre = capitalizeFullName(nombrePaciente).split(" ");

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

function funcionCompletaRetinografia() {
  const dataExcel = leerExcel("baseDatos.xlsx");
  function numeroAlAzar(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  for (let i = 0; i < dataExcel.length; i++) {
    if (dataExcel[i].Retinografia == "x") {
      const nombrePaciente = dataExcel[i].Paciente;
      createRetinografiaPdf(
        "./retinografia/" + numeroAlAzar(1, 6) + ".pdf",
        capitalizeFullName(nombrePaciente) + " RETINOGRAFIA" + ".pdf",
        i
      );
    }
  }
}
funcionCompletaRetinografia();
