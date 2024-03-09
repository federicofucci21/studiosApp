const XLSX = require("xlsx");

// FUNCION PARA OBTENER EN FORMATO JSON LOS DATOS DEL EXCEL
function leerExcel(ruta) {
    const workBook = XLSX.readFile(ruta);
    const workBookSheets = workBook.SheetNames;
    const sheet = workBookSheets[0];
    const dataExcel = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
    console.log(dataExcel);
    return dataExcel;
  }

  // leerExcel('baseDatos.xlsx')
  