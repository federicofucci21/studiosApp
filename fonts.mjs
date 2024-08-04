const fs = require('fs');
import { PDFDocument } from 'pdfjs-dist/legacy/build/pdf';

async function extractFontsFromPdf() {
  // Leer el archivo PDF
  const existingPdfBytes = fs.readFileSync('./iolOS.pdf');

  // Cargar el documento PDF
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const numPages = pdfDoc.numPages;
  for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
    const page = await pdfDoc.getPage(pageIndex);
    const content = await page.getTextContent();

    console.log(`Página ${pageIndex}`);

    content.items.forEach((item) => {
      if (item.fontName) {
        console.log(`Texto: ${item.str}, Fuente: ${item.fontName}`);
      }
    });
  }
}

extractFontsFromPdf().catch((err) => console.error(err));
