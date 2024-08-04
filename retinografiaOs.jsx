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
  // console.log("PALABRAS", words)
  // Unir las palabras nuevamente en un solo string
  return words.join(" ");
}

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

//FUNCION PARA QUITAR PUNTOS DEL DNI
function quitarPuntosDNI(dni) {
  dni = dni.toString();
  // Utilizamos una expresión regular para encontrar y reemplazar los puntos en el DNI
  return dni.replace(/\./g, "");
}

// FUNCION PARA CREAR NUEVO PDF PAQUI
async function createRetinografiaOsPdf(input, output, i) {
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
    if (genero === "h") {
      genero = "Masculino";
    } else {
      genero = "Femenino";
    }
    // console.log(dataExcel[i].Hora);

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

//FUNCION PARA QUITAR PUNTOS DEL DNI
function quitarPuntosDNI(dni) {
  dni = dni.toString();
  // Utilizamos una expresión regular para encontrar y reemplazar los puntos en el DNI
  return dni.replace(/\./g, "");
}

    //NOMBRE
    firstPage.drawText(nombrePaciente.toUpperCase(), {
      x: 120,
      y: 513,
      // font: customFont,
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
    // console.log("nombre");

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
    firstPage.drawText(
      fechaCambiada.toString() +
        " " +
        sumarMinutosAHorario(hora, minutosTopo) +
        ":05",
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
        ":47",
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

function funcionCompletaRetinografia2() {
  const dataExcel = leerExcel("baseDatos.xlsx");
  function numeroAlAzar(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
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
    return nuevaFecha;
  }

  for (let i = 0; i < dataExcel.length; i++) {
    if (dataExcel[i].Retinografia == "x") {
      const nombrePaciente = dataExcel[i].Paciente.replace(/\n$/, "");
      const fechaValidacion = dataExcel[i].FechaValidacion;
      const dateForTitle = cambiarFormatoFecha(fechaValidacion);
      createRetinografiaOsPdf(
        "./retinografiaOs/" + numeroAlAzar(1, 4) + ".pdf",
        capitalizeFullName(nombrePaciente) + "_RETINOGRAFIA_" + dateForTitle + ".pdf",
        i
      );
    }
  }
}

funcionCompletaRetinografia2();
