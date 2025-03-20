import { PDFDocument, rgb, degrees } from 'pdf-lib';
import axios from "axios";
import Constants from "../Utils/Constants";


export const exportMatchPdf = async(evaluationData, token) => {
  try {
    const url = '/evaluation_pdf/Arbre_decisionnel_MATCH.pdf';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    // DATE
    firstPage.drawText(evaluationData.date, {x: 120, y: 708, size: 12});

    // DONNEES DE PATIENT
    const patient = await axios.get(
      `${Constants.SERVER_URL}/patient/${parseInt(evaluationData.idPatient)}`,
      { headers: { Authorization: "Bearer " + token } }
    );

    const lines = [
      "Patient:",
      `${patient.data.firstname} ${patient.data.lastname}`,
      `Date de naissance: ${patient.data.birthday}`,
      `Poids: ${patient.data.weight} ${patient.data.weightUnit}`
    ];
    
    const startX = 315;
    const startY = 763;
    const fontSize = 12;
    const lineHeight = fontSize * 1.0; 
    
    lines.forEach((line, index) => {
      firstPage.drawText(line, {
        x: startX,
        y: startY - (index * lineHeight), // Move down for each subsequent line
        size: fontSize,
      });
    });

    // TODO: Nom de kine


    // CARDIO-MUSCULAIRE
    firstPage.drawText(`${evaluationData.chairTestCount}`, {x: 70, y: 543, size: 12});

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
      default:
    }

    // EQUILIBRE
    firstPage.drawText(`(Temps réalisé: ${evaluationData.balanceFeetTogether} sec)`, {
        x: 26,
        y: 436,
        size: 11,
    });

    firstPage.drawText(`(Temps réalisé: ${evaluationData.balanceSemiTandem} sec)`, {
      x: 26,
      y: 403,
      size: 11,
    });

    firstPage.drawText(`${evaluationData.balanceSemiTandem}`, {
      x: 104,
      y: 373,
      size: 11,
    });

    switch (evaluationData.scores.equilibre) {
      case 0:
        firstPage.drawCircle({
          x: 532,
          y: 453,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 1:
        firstPage.drawCircle({
          x: 532,
          y: 438,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 2:
        firstPage.drawCircle({
          x: 532,
          y: 422,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
      break;
      case 3:
        firstPage.drawCircle({
          x: 532,
          y: 407,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 4:
        firstPage.drawCircle({
          x: 532,
          y: 377,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      default:
    }

    // SCORE ET PROGRAMMME RECOMMANDE
    firstPage.drawText(`${evaluationData.scores.total}`, {
      x: 490,
      y: 341.3,
      size: 11,
    });

    switch (evaluationData.scores.program) {
      case "ROUGE":
        firstPage.drawText('+', {x: 30.5, y: 300.5, size: 20, rotate: degrees(45)});
        break;
      case "JAUNE":
        firstPage.drawText('+', {x: 30.5, y: 285.5, size: 20, rotate: degrees(45)});
        break;
      case "ORANGE":
        firstPage.drawText('+', {x: 30.5, y: 271, size: 20, rotate: degrees(45)});
        break;
      case "VERT":
        firstPage.drawText('+', {x: 323, y: 300.5, size: 20, rotate: degrees(45)});
        break;
      case "BLEU":
        firstPage.drawText('+', {x: 322, y: 285.5, size: 20, rotate: degrees(45)});
        break;
      default:
        break;
    }

    // TEMPS DE MARCHE
    if (isNaN(evaluationData.walkingTime)) {
      firstPage.drawText('+', {x: 31, y: 161, size: 20, rotate: degrees(45)});
    } else {
      const walkingSpeed = 4 / evaluationData.walkingTime;
      firstPage.drawText('+', {x: 31.5, y: 146, size: 20, rotate: degrees(45)});
      firstPage.drawText(`${evaluationData.walkingTime}`, {x: 228, y:150, size: 12})
      firstPage.drawText(`${evaluationData.walkingTime}`, {x: 228, y:150, size: 12})
      firstPage.drawText(`${walkingSpeed.toFixed(2)}`, {x: 453, y:150, size: 12})

      if (walkingSpeed < 0.4) {
        firstPage.drawLine({
          start: {x: 188, y: 103},
          end: {x: 220, y: 103},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      } else if (walkingSpeed < 0.6) {
        firstPage.drawLine({
          start: {x: 290, y: 103},
          end: {x: 322, y: 103},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      } else if (walkingSpeed < 0.8) {
        firstPage.drawLine({
          start: {x: 403, y: 103},
          end: {x: 435, y: 103},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      } else {
        firstPage.drawLine({
          start: {x: 518, y: 103},
          end: {x: 550, y: 103},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      }
    }
    
    // TELECHARGEMENT VERS UTILISATEUR
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${evaluationData.date}_${patient.data.lastname}_${patient.data.firstname}_MATCH.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please check the console for details.');
  }
}