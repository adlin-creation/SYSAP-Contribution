import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { Modal } from "antd";
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

    const patientLines = [
      "Patient:",
      `${patient.data.firstname} ${patient.data.lastname}`,
      `Date de naissance: ${patient.data.birthday}`,
      `Poids: ${patient.data.weight} ${patient.data.weightUnit}`
    ];
    
    drawMultipleLines(firstPage, patientLines, 315, 763, 12, 1);

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
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 1:
        firstPage.drawCircle({
          x: 532,
          y: 608,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 2:
        firstPage.drawCircle({
          x: 532,
          y: 588,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
      break;
      case 3:
        if (evaluationData.chairTestSupport === "with") {
          firstPage.drawCircle({
            x: 532,
            y: 569,
            size : 8,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
        } else if (evaluationData.chairTestSupport === "without") {
          firstPage.drawCircle({
            x: 532,
            y: 549,
            size : 8,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
        }
        break;
      case 4:
        firstPage.drawCircle({
          x: 532,
          y: 528,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 5:
        firstPage.drawCircle({
          x: 532,
          y: 513,
          size: 8,
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
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 1:
        firstPage.drawCircle({
          x: 532,
          y: 438,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 2:
        firstPage.drawCircle({
          x: 532,
          y: 422,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
      break;
      case 3:
        firstPage.drawCircle({
          x: 532,
          y: 407,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 4:
        firstPage.drawCircle({
          x: 532,
          y: 377,
          size : 8,
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
    if (evaluationData.walkingTime === 0) {
      firstPage.drawText('+', {x: 31, y: 161, size: 20, rotate: degrees(45)});
    } else {
      const walkingSpeed = 4 / evaluationData.walkingTime;
      firstPage.drawText('+', {x: 31.5, y: 146, size: 20, rotate: degrees(45)});
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
    downloadPdf(pdfBytes, `${evaluationData.date}_${patient.data.lastname}_${patient.data.firstname}_MATCH.pdf`);
  } catch (error) {
    handleError(error);
  }
}

export const exportPathPdf = async(evaluationData, token) => {
  try {
    const url = '/evaluation_pdf/Arbre_decisionnel_PATH.pdf';
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

    const patientLines = [
      "Patient:",
      `${patient.data.firstname} ${patient.data.lastname}`,
      `Date de naissance: ${patient.data.birthday}`,
      `Poids: ${patient.data.weight} ${patient.data.weightUnit}`
    ];

    drawMultipleLines(firstPage, patientLines, 315, 750, 12, 1);

    // TODO: Nom de kine


    // CARDIO-MUSCULAIRE
    firstPage.drawText(`${evaluationData.chairTestCount}`, {x: 42, y: 536, size: 12});

    if (evaluationData.chairTestSupport === "with") {
      firstPage.drawLine({
        start: {x: 207.5, y: 526},
        end: {x: 249, y: 526},
        thickness: 2,
        color: rgb(1, 0, 0),
      });
    } else if (evaluationData.chairTestSupport === "without") {
      firstPage.drawLine({
        start: {x: 207.5, y: 579},
        end: {x: 249, y: 579},
        thickness: 2,
        color: rgb(1, 0, 0),
      });
    }
    
    switch (evaluationData.scores.cardioMusculaire) {
      case 0:
        firstPage.drawCircle({
          x: 532,
          y: 516,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 1:
        firstPage.drawCircle({
          x: 532,
          y: 531,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 2:
        firstPage.drawCircle({
          x: 532,
          y: 546,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
      break;
      case 3:
        if (evaluationData.chairTestSupport === "with") {
          firstPage.drawCircle({
            x: 532,
            y: 561,
            size : 8,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
        } else if (evaluationData.chairTestSupport === "without") {
          firstPage.drawCircle({
            x: 532,
            y: 576,
            size : 8,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
        }
        break;
      case 4:
        firstPage.drawCircle({
          x: 532,
          y: 592,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 5:
        firstPage.drawCircle({
          x: 532,
          y: 607,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      default:
    }

    // EQUILIBRE
    firstPage.drawText(`(Temps réalisé: ${evaluationData.balanceFeetTogether} sec)`, {
        x: 26,
        y: 440,
        size: 11,
    });

    firstPage.drawText(`(Temps réalisé: ${evaluationData.balanceSemiTandem} sec)`, {
      x: 26,
      y: 407,
      size: 11,
    });

    firstPage.drawText(`${evaluationData.balanceSemiTandem}`, {
      x: 104,
      y: 377,
      size: 11,
    });

    switch (evaluationData.scores.equilibre) {
      case 0:
        firstPage.drawCircle({
          x: 532,
          y: 456,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 1:
        firstPage.drawCircle({
          x: 532,
          y: 441,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 2:
        firstPage.drawCircle({
          x: 532,
          y: 425,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
      break;
      case 3:
        firstPage.drawCircle({
          x: 532,
          y: 408,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 4:
        firstPage.drawCircle({
          x: 532,
          y: 380,
          size : 8,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      default:
    }

    // SCORE ET PROGRAMMME RECOMMANDE
    switch (evaluationData.scores.cardioMusculaire) {
      case 0:
        firstPage.drawCircle({
          x: 205,
          y: 324,
          size: 7,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 1:
        firstPage.drawCircle({
          x: 222,
          y: 324,
          size: 7,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 2:
        firstPage.drawCircle({
          x: 241.5,
          y: 324,
          size: 7,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 3:
        firstPage.drawCircle({
          x: 260.5,
          y: 324,
          size: 7,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 4:
        firstPage.drawCircle({
          x: 280,
          y: 324,
          size: 7,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 5:
        firstPage.drawCircle({
          x: 299.5,
          y: 324,
          size: 7,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      default:
    }


    switch (evaluationData.scores.equilibre) {
      case 0:
        firstPage.drawCircle({
          x: 205,
          y: 310.5,
          size: 7,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 1:
        firstPage.drawCircle({
          x: 222,
          y: 310.5,
          size: 7,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 2:
        firstPage.drawCircle({
          x: 241.5,
          y: 310.5,
          size: 7,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 3:
        firstPage.drawCircle({
          x: 260.5,
          y: 310.5,
          size: 7,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 4:
        firstPage.drawCircle({
          x: 280,
          y: 310.5,
          size: 7,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      default:
    }

    firstPage.drawText(evaluationData.scores.program, {x: 455, y: 281, size: 15})

    // TEMPS DE MARCHE
    if (evaluationData.walkingTime === 0) {
      firstPage.drawText('+', {x: 31, y: 170, size: 20, rotate: degrees(45)});
    } else {
      const walkingSpeed = 4 / evaluationData.walkingTime;
      firstPage.drawText('+', {x: 31.5, y: 153, size: 20, rotate: degrees(45)});
      firstPage.drawText(`${evaluationData.walkingTime}`, {x: 228, y:157, size: 12})
      firstPage.drawText(`${walkingSpeed.toFixed(2)}`, {x: 440, y:157, size: 12})

      if (walkingSpeed < 0.4) {
        firstPage.drawLine({
          start: {x: 188, y: 115},
          end: {x: 220, y: 115},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      } else if (walkingSpeed < 0.6) {
        firstPage.drawLine({
          start: {x: 290, y: 115},
          end: {x: 322, y: 115},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      } else if (walkingSpeed < 0.8) {
        firstPage.drawLine({
          start: {x: 403, y: 115},
          end: {x: 435, y: 115},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      } else {
        firstPage.drawLine({
          start: {x: 518, y: 115},
          end: {x: 550, y: 115},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      }
    }
    
    // TELECHARGEMENT VERS UTILISATEUR
    const pdfBytes = await pdfDoc.save();
    downloadPdf(pdfBytes, `${evaluationData.date}_${patient.data.lastname}_${patient.data.firstname}_PATH.pdf`);
  } catch (error) {
    handleError(error);
  }
}

export const exportPacePdf = async(evaluationData, token) => {
  try {
    const url = '/evaluation_pdf/Arbre_decisionnel_PACE.pdf';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    // DATE
    firstPage.drawText(`Date d'évaluation: ${evaluationData.date}`, {x: 130, y: 770, size: 8});

    // DONNEES DE PATIENT
    const patient = await axios.get(
      `${Constants.SERVER_URL}/patient/${parseInt(evaluationData.idPatient)}`,
      { headers: { Authorization: "Bearer " + token } }
    );

    const patientLines = [
      "Patient:",
      `${patient.data.firstname} ${patient.data.lastname}`,
      `Date de naissance: ${patient.data.birthday}`,
      `Poids: ${patient.data.weight} ${patient.data.weightUnit}`
    ];
    
    drawMultipleLines(firstPage, patientLines, 270, 770, 8, 1)

    // TODO: Nom de kine


    // A - CARDIO-MUSCULAIRE
    firstPage.drawText(`${evaluationData.chairTestCount}`, {x: 150, y: 694, size: 12});

    if (evaluationData.chairTestSupport === "with") {
      firstPage.drawText("Avec support", {x: 88, y: 681, size: 12});
    } else if (evaluationData.chairTestSupport === "without") {
      firstPage.drawText("Sans support", {x: 88, y: 681, size: 12});
    }
    
    switch (evaluationData.scores.cardioMusculaire) {
      case 0:
        firstPage.drawCircle({
          x: 512.5,
          y: 718,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 1:
        firstPage.drawCircle({
          x: 512.5,
          y: 700,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 2:
        firstPage.drawCircle({
          x: 512.5,
          y: 674,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 3:
        firstPage.drawCircle({
          x: 512.5,
          y: 648,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 4:
        firstPage.drawCircle({
          x: 512.5,
          y: 630,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 5:
        firstPage.drawCircle({
          x: 512.5,
          y: 613,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 6:
        firstPage.drawCircle({
          x: 512.5,
          y: 595,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      default:
    }

    // B- EQUILIBRE
    firstPage.drawRectangle({x: 40, y:438.48, width: 150, height: 60, color: rgb(1, 1, 1)});

    const balanceLines = [
      "Temps a l'équilibre:",
      `Pieds joints: ${evaluationData.balanceFeetTogether} s`,
      `Semi-tandem: ${evaluationData.balanceSemiTandem} s`,
      `Tandem: ${evaluationData.balanceTandem} s`,
      `Unipodal: ${evaluationData.balanceOneFooted} s`
    ];    
    drawMultipleLines(firstPage, balanceLines, 40, 490, 11, 1);

    switch (evaluationData.scores.equilibre) {
      case 0:
        firstPage.drawCircle({
          x: 512.5,
          y: 563,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 1:
        firstPage.drawCircle({
          x: 512.5,
          y: 545,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 2:
        firstPage.drawCircle({
          x: 512.5,
          y: 528,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 3:
        firstPage.drawCircle({
          x: 512.5,
          y: 510,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 4:
        firstPage.drawCircle({
          x: 512.5,
          y: 493,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 5:
        firstPage.drawCircle({
          x: 512.5,
          y: 475,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 6:
        firstPage.drawCircle({
          x: 512.5,
          y: 452,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      default:
    }

    // C - MOBILITÉ & STABILITÉ DU TRONC 
    firstPage.drawText(`Distance réussi: ${evaluationData.frtDistance} cm`, {x: 230, y: 407, size: 10});

    switch (evaluationData.frtSitting) {
      case "sitting":
        firstPage.drawLine({
          start: {x: 385, y: 408},
          end: {x: 415, y: 408},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
        break;
      case "standing":
        firstPage.drawLine({
          start: {x: 498, y: 408},
          end: {x: 537, y: 408},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
        break;
      default:
    }

    switch (evaluationData.scores.mobilite) {
      case 0:
        firstPage.drawCircle({
          x: 458,
          y: 388,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 1:
        firstPage.drawCircle({
          x: 400,
          y: 371,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 2:
        firstPage.drawCircle({
          x: 400,
          y: 353,
          size: 9,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0)
        });
        break;
      case 3:
        if (evaluationData.frtSitting === "sitting") {
          firstPage.drawCircle({
            x: 400,
            y: 336,
            size: 9,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
        } else if (evaluationData.frtSitting === "standing") {
          firstPage.drawCircle({
            x: 517,
            y: 371,
            size: 9,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
        }
        break;
      case 4:
        if (evaluationData.frtSitting === "sitting") {
          firstPage.drawCircle({
            x: 400,
            y: 318,
            size: 9,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
        } else if (evaluationData.frtSitting === "standing") {
          firstPage.drawCircle({
            x: 517,
            y: 353,
            size: 9,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
        }
        break;
        case 5:
          firstPage.drawCircle({
            x: 517,
            y: 336,
            size: 9,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
          break;
        case 6:
          firstPage.drawCircle({
            x: 517,
            y: 318,
            size: 9,
            borderWidth: 2,
            borderColor: rgb(1, 0, 0)
          });
          break;
      default:
    }

    // SCORE ET PROGRAMMME RECOMMANDE
    switch (evaluationData.scores.color) {
      case "BLEU":
        firstPage.drawLine({
          start: {x: 53, y: 233},
          end: {x: 78, y: 233},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
        break;
      case "JAUNE":
        firstPage.drawLine({
          start: {x: 107, y: 233},
          end: {x: 140, y: 233},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
        break;
      case "ROUGE":
        firstPage.drawLine({
          start: {x: 171, y: 233},
          end: {x: 204, y: 233},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
        break;
      case "VERT":
        firstPage.drawLine({
          start: {x: 272, y: 233},
          end: {x: 296, y: 233},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      break;
      case "ORANGE":
        firstPage.drawLine({
          start: {x: 334, y: 233},
          end: {x: 373, y: 233},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
        break;
      case "VIOLET":
        firstPage.drawLine({
          start: {x: 411, y: 233},
          end: {x: 442, y: 233},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
        break;
      case "MARRON":
        firstPage.drawLine({
          start: {x: 511, y: 233},
          end: {x: 552, y: 233},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
        break;
      default:
    }

    switch (evaluationData.scores.level) {
      case "I":
        firstPage.drawCircle({
          x: 260.5,
          y: 200,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0),
        });
        break;
      case "II":
        firstPage.drawCircle({
          x: 333,
          y: 200,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0),
        });
        break;
      case "III":
        firstPage.drawCircle({
          x: 402.5,
          y: 200,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0),
        });
        break;
      case "IV":
        firstPage.drawCircle({
          x: 472,
          y: 200,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0),
        });
        break;
      case "V":
        firstPage.drawCircle({
          x: 541,
          y: 200,
          size: 10,
          borderWidth: 2,
          borderColor: rgb(1, 0, 0),
        });
        break;
    default:
    }

    firstPage.drawRectangle({x: 430, y: 170, width: 80, height: 15, color: rgb(1, 1, 1)});
    firstPage.drawText(`${evaluationData.scores.program}`, {x: 440, y: 172, size: 12});


    // TEMPS DE MARCHE
    if (evaluationData.walkingTime === 0) {
      firstPage.drawText('Le patient ne peut pas marcher', {x: 310, y: 137, size: 12});
    } else {
      const walkingSpeed = 4 / evaluationData.walkingTime;
      firstPage.drawText(`${evaluationData.walkingTime}`, {x: 285, y: 124, size: 12})
      firstPage.drawText(`${walkingSpeed.toFixed(2)}`, {x: 500, y: 124, size: 12})

      if (walkingSpeed < 0.4) {
        firstPage.drawLine({
          start: {x: 88, y: 79},
          end: {x: 122, y: 79},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      } else if (walkingSpeed < 0.6) {
        firstPage.drawLine({
          start: {x: 222, y: 79},
          end: {x: 256, y: 79},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      } else if (walkingSpeed < 0.8) {
        firstPage.drawLine({
          start: {x: 356, y: 79},
          end: {x: 392, y: 79},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      } else {
        firstPage.drawLine({
          start: {x: 490, y: 79},
          end: {x: 526, y: 79},
          thickness: 2,
          color: rgb(1, 0, 0)
        });
      }
    }
    
    // TELECHARGEMENT VERS UTILISATEUR
    const pdfBytes = await pdfDoc.save();
    downloadPdf(pdfBytes, `${evaluationData.date}_${patient.data.lastname}_${patient.data.firstname}_PACE.pdf`);
  } catch (error) {
    handleError(error);
  }
}

const drawMultipleLines = (page, lines, x, y, size, lineHeight) => {
  lines.forEach((line, index) => {
    page.drawText(line, {
      x: x,
      y: y - (index * lineHeight * size),
      size: size,
    });
  });
}

const downloadPdf = (pdfBytes, name) => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

const handleError = (error) => {
  console.error('Échec de la génération du PDF:', error);
  let errorMessage = 'Échec de la génération du PDF. Détails: ' + (error.message || 'Erreur inconnue');
  
  if (error.isAxiosError && error.response?.status === 500) {
    errorMessage = 'Échec d\'authentification. Veuillez vous reconnecter.';
  }

  Modal.error({
    title: 'Erreur',
    content: errorMessage,
  });
}