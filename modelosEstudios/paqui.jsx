const { PDFDocument, rgb } = require("pdf-lib");
const { readFile, writeFile } = require("fs/promises");
const { leerExcel } = require("../leerExcel")

// FUNCION PARA CREAR NUEVO PDF
async function createPdf(input, output) {
    try {
      const pdfDoc = await PDFDocument.load(await readFile(input));
      
      //PRUEBA DE ESCRIBIR EN EL DOCUMENTO
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
  
      //OBTENER NOMBRE DE EXCEL
  
          const dataExcel = leerExcel('baseDatos.xlsx');
  
      const nombrePaciente = dataExcel[2].Paciente;
  
      // Agregar un nuevo campo de texto a la primera página
    const textField = {
      type: 'Tx',
      x: 50,
      y: 400,
      width: 200,
      height: 50,
      // font: pdfDoc.embedFont('Helvetica'),
      fontSize: 12,
      // textColor: rgb(0, 0, 0),
      // borderColor: rgb(0, 0, 0),
      // borderWidth: 1,
      value: 'Texto predeterminado',
    };
    firstPage.drawText(nombrePaciente,
    {
      x: 70,
      y: 700,
      size: 14,
      color: rgb(0, 1, 0),
      lineHeight: 24,
      opacity: 0.75,
    });
  
  
    // Serializar el documento PDF modificado
    const pdfBytes = await pdfDoc.save();
  
    await writeFile(output, pdfBytes);
  
    } catch (error) {
      console.log(error);
    }
  };