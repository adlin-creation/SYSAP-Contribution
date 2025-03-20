import { PDFDocument, rgb } from 'pdf-lib';

export const exportMatchPdf = async(evaluationData) => {
  try {
    console.log('Full evaluationData:', evaluationData);
    const url = '/evaluation_pdf/Arbre_decisionnel_MATCH.pdf';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    firstPage.drawText(evaluationData.date, {x: 120, y: 708, size: 12});
    // patient
    // kine

    firstPage.drawText("" + evaluationData.chairTestCount, {x: 70, y: 543, size: 12});

    if (evaluationData.chairTestSupport === "with") {
      firstPage.drawLine({
        start: {x: 207.5, y: 592},
        end: {x: 249, y: 592},
        thickness: 2,
        color: rgb(1, 0, 0),
      });
    } else if (evaluationData.chairTestSupport === "without") {
      firstPage.drawLine({
        start: {x: 207.5, y: 529},
        end: {x: 249, y: 529},
        thickness: 2,
        color: rgb(1, 0, 0),
      });
    }
    // cercles autour du score cardio musculaire
    switch (evaluationData.scores.cardioMusculaire) {
      case 0:
        firstPage.drawCircle({
          x: 532,
          y: 624,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 1:
        firstPage.drawCircle({
          x: 532,
          y: 608,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 2:
        firstPage.drawCircle({
          x: 532,
          y: 588,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
      break;
      case 3:
        if (evaluationData.chairTestSupport === "with") {
          firstPage.drawCircle({
            x: 532,
            y: 569,
            size: 10,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
        } else if (evaluationData.chairTestSupport === "without") {
          firstPage.drawCircle({
            x: 532,
            y: 549,
            size: 10,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
        }
        break;
      case 4:
        firstPage.drawCircle({
          x: 532,
          y: 528,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 5:
        firstPage.drawCircle({
          x: 532,
          y: 513,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
    }



    const pdfBytes = await pdfDoc.save();

    // Trigger download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'match-evaluation.pdf'; // Set the filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // Clean up memory

  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please check the console for details.');
  }
}