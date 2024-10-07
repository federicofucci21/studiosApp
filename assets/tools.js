import XLSX from "xlsx";

//FUNCION PARA OBTENER EN FORMATO JSON LOS DATOS DEL EXCEL
export function leerExcel(ruta) {
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
export function capitalizeFullName(fullName) {
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

//FUNCION PARA QUITAR PUNTOS DEL DNI
export function quitarPuntosDNI(dni) {
  dni = dni.toString();
  if (dni === undefined || dni === null) {
    return "ERROR DE DNI";
  }
  // Utilizamos una expresión regular para encontrar y reemplazar los puntos en el DNI
  return dni.replace(/\./g, "");
}

export function sumarMinutosAHorario(horario, minutosASumar) {
  // Convertir el horario a horas y minutos
  const [horas, minutos] = horario.split(":").map(Number);

  // Sumar los minutos
  const totalMinutos = horas * 60 + minutos + minutosASumar;

  // Calcular las nuevas horas y minutos
  const nuevasHoras = Math.floor(totalMinutos / 60);
  const nuevosMinutos = totalMinutos % 60;

  // Formatear el resultado en formato de hora (HH:MM)
  const horaFinal = `${nuevasHoras.toString().padStart(2, "0")}:${nuevosMinutos
    .toString()
    .padStart(2, "0")}`;

  return horaFinal;
}

//FUNCION PARA CAMBIAR EL FORMATO DE LA FECHA (año - mes - dia)
export function cambiarFormatoFecha(fecha) {
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

//FUNCION PARA MODIFICAR FORMATO DE FECHA (Dia / Mes / Año)
export function cambiarFormatoFechaNacimiento(fecha) {
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
  var nuevaFecha = dia + "/" + mes + "/" + año;
  return nuevaFecha;
}

//FUNCION PARA MODIFICAR FORMATO DE FECHA (Año - Mes - Dia)
export function cambiarFormatoFechaNacimientoAMD(fecha) {
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

//FUNCION PARA MODIFICAR FORMATO DE FECHA (dia - mes - año)
export function cambiarFormatoFechaGuion(fecha) {
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

//FUNCION PARA OBTENER UN NUMERO AL AZAR
export function numeroAlAzar(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function agregarPuntosDNI(dni) {
  // Convertir el número de DNI a string para facilitar la manipulación
  dni = dni.toString();

  // Verificar que el número de DNI tenga al menos 7 dígitos
  if (dni.length < 7) {
    return "El número de DNI debe tener al menos 7 dígitos.";
  }
  if (dni.length == 7) {
    // Agregar puntos según el formato estándar
    var dniConPuntos =
      dni.substring(0, 1) + "." + dni.substring(1, 4) + "." + dni.substring(4);
    return dniConPuntos;
  }
  if (dni.length == 8) {
    // Agregar puntos según el formato estándar
    var dniConPuntos =
      dni.substring(0, 2) + "." + dni.substring(2, 5) + "." + dni.substring(5);
    // dni.substring(0) + "." + dni.substring(1, 3) + "." + dni.substring(4);
    return dniConPuntos;
  }
}

// FUNCION PARA CALCULAR LA EDAD
export function calcularEdad(fechaNacimiento) {
  var hoy = new Date();
  var fechaNacimiento = new Date(fechaNacimiento);
  var edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  var mes = hoy.getMonth() - fechaNacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }

  return edad;
}

// const partesFecha = cambiarFormatoFecha(fechaNacimiento).split("-");
// function numeroAlAzar(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

export function folderTittle(array) {
  // Función para formatear las fechas en "yyyy-mm-dd" (sin hora)
  function formatearFecha(fecha) {
    let dia = fecha.getDate().toString().padStart(2, "0");
    let mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Los meses en JS van de 0 a 11
    let anio = fecha.getFullYear();
    return dia;
    // return `${dia}-${mes}-${anio}`;
  }
  let datesArray = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i].FechaValidacion) {
      datesArray.push(
        new Date(cambiarFormatoFechaNacimientoAMD(array[i].FechaValidacion))
      );
    }
  }

  // Obtener la fecha más antigua (mínima)
  let fechaMinima = new Date(Math.min(...datesArray));

  // Obtener la fecha más reciente (máxima)
  let fechaMaxima = new Date(Math.max(...datesArray));

  // Formar la cadena final
  if (array[i].P) {
    let resultado = `${formatearFecha(fechaMinima)} al ${formatearFecha(
      fechaMaxima
    )} - PAMI`;
    return resultado;
  }
  if (array[i].B) {
    let resultado = `${formatearFecha(fechaMinima)} al ${formatearFecha(
      fechaMaxima
    )} - BARADERO`;
    return resultado;
  }
  if (array[i].SP) {
    let resultado = `${formatearFecha(fechaMinima)} al ${formatearFecha(
      fechaMaxima
    )} - SAN PEDRO`;
    return resultado;
  }
  // let resultado = `${formatearFecha(fechaMinima)} al ${formatearFecha(
  //   fechaMaxima
  // )}`;
}
