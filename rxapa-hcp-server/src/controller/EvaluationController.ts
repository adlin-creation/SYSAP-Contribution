import { Request, Response } from "express";
import { Evaluation } from "../model/Evaluation";
import { Evaluation_PACE } from "../model/Evaluation_PACE";
import { sequelize } from "../util/database";
import { Patient } from "../model/Patient";
import { Op } from "sequelize";

exports.createEvaluation = async (req: any, res: any, next: any) => {
  const {
    idPatient,
    idKinesiologist,
    chairTestSupport,
    chairTestCount,
    balanceFeetTogether,
    balanceSemiTandem,
    balanceTandem,
    balanceOneFooted,
    frtPosition,
    frtDistance,
    walkingTime,
    scores,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    // Vérifier si les données essentielles sont présentes
    if (!scores) {
      return res.status(400).json({ 
        message: "Données incomplètes: l'objet scores est requis",
        receivedData: req.body 
      });
    }

    // Créer l'évaluation
    const evaluation = await Evaluation.create(
      {
        idPatient: idPatient || null,
        idKinesiologist: idKinesiologist || null,
        idResultProgram: scores.programme || null, // Maintenant une chaîne de caractères
      },
      { transaction: t }
    );

    // Calculer la vitesse et l'objectif de marche
    const walkingTimeFloat = parseFloat(walkingTime);
    const vitesse = !isNaN(walkingTimeFloat) && walkingTimeFloat > 0 
      ? 4 / walkingTimeFloat 
      : 0;
      
    let objectifMarche = 1; // 10 min par défaut
    if (vitesse >= 0.8) objectifMarche = 4; // 30 min
    else if (vitesse >= 0.6) objectifMarche = 3; // 20 min
    else if (vitesse >= 0.4) objectifMarche = 2; // 15 min

    // Déterminer la valeur de frtSitting en fonction de frtPosition
    let frtSitting = false;
    if (frtPosition === true || frtPosition === "sitting") {
      frtSitting = true;
    }

    await Evaluation_PACE.create(
      {
        // Section A
        idPACE: evaluation.id,
        chairTestSupport: chairTestSupport === true,
        chairTestCount: parseInt(chairTestCount) || 0,
        scoreA: scores.cardioMusculaire || 0,
        // Section B
        balanceFeetTogether: parseInt(balanceFeetTogether) || 0,
        balanceSemiTandem: parseInt(balanceSemiTandem) || 0,
        balanceTandem: parseInt(balanceTandem) || 0,
        balanceOneFooted: parseInt(balanceOneFooted) || 0,
        scoreB: scores.equilibre || 0,
        // Section C
        frtSitting: frtSitting,
        frtDistance: parseInt(frtDistance) || 0,
        scoreC: scores.mobilite || 0,
        // Scores et vitesse
        scoreTotal: scores.total || 0,
        vitesseDeMarche: vitesse,
        objectifMarche: objectifMarche,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ 
      evaluation, 
      scores, 
      objectifMarche,
      message: "Évaluation créée avec succès" 
    });
  } catch (error: any) {
    await t.rollback();
    console.error("Erreur détaillée:", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ 
      message: "Error creating evaluation", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
  return res;
};

// Mise à jour similaire pour updateEvaluation
exports.updateEvaluation = async (req: any, res: any, next: any) => {
  const evaluationId = req.params.id;
  const {
    chairTestSupport,
    chairTestCount,
    balanceFeetTogether,
    balanceSemiTandem,
    balanceTandem,
    balanceOneFooted,
    frtPosition,
    frtDistance,
    walkingTime,
    scores,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    const paceEvaluation = await Evaluation_PACE.findByPk(evaluationId);
    if (!paceEvaluation) {
      return res.status(404).json({ message: "PACE evaluation not found" });
    }

    // Mettre à jour l'évaluation de base
    await evaluation.update(
      {
        idResultProgram: scores?.programme || evaluation.idResultProgram,
      },
      { transaction: t }
    );

    const vitesse = walkingTime ? 4 / parseFloat(walkingTime) : 0;
    let objectifMarche = 1;
    if (vitesse >= 0.8) objectifMarche = 4;
    else if (vitesse > 0.6) objectifMarche = 3;
    else if (vitesse >= 0.4) objectifMarche = 2;

    // Déterminer la valeur de frtSitting en fonction de frtPosition
    let frtSitting = false;
    if (frtPosition === true || frtPosition === "sitting") {
      frtSitting = true;
    }

    // Update PACE evaluation
    await paceEvaluation.update(
      {
        chairTestSupport: chairTestSupport === true,
        chairTestCount: parseInt(chairTestCount) || 0,
        scoreA: scores.cardioMusculaire || 0,
        balanceFeetTogether: parseInt(balanceFeetTogether) || 0,
        balanceSemiTandem: parseInt(balanceSemiTandem) || 0,
        balanceTandem: parseInt(balanceTandem) || 0,
        balanceOneFooted: parseInt(balanceOneFooted) || 0,
        scoreB: scores.equilibre || 0,
        frtSitting: frtSitting,
        frtDistance: parseInt(frtDistance || "0") || 0,
        scoreC: scores.mobilite || 0,
        scoreTotal: scores.total || 0,
        vitesseDeMarche: vitesse,
        objectifMarche: objectifMarche,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(200).json({
      evaluation,
      paceEvaluation,
      scores,
      message: "Évaluation mise à jour avec succès"
    });
  } catch (error: any) {
    await t.rollback();
    console.error("Erreur détaillée:", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({
      message: "Error updating evaluation",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
  return res;
};

/**
 * Returns a specific PACE evaluation based on ID.
 */
exports.getEvaluation = async (req: any, res: any, next: any) => {
  const evaluationId = req.params.id;
  try {
    const evaluation = await Evaluation.findOne({
      where: { id: evaluationId },
      include: [
        {
          model: Evaluation_PACE,
          required: true,
        },
      ],
    });

    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }
    res.status(200).json(evaluation);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Error loading evaluation from the database" });
  }
  return res;
};

/**
 * Returns all PACE evaluations.
 */
exports.getEvaluations = async (req: any, res: any, next: any) => {
  try {
    const evaluations = await Evaluation.findAll({
      include: [
        {
          model: Evaluation_PACE,
          required: true,
        },
      ],
    });
    res.status(200).json(evaluations);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Error loading evaluations from the database" });
  }
  return res;
};

/**
 * Deletes a PACE evaluation.
 */
exports.deleteEvaluation = async (req: any, res: any, next: any) => {
  const evaluationId = req.params.id;
  const t = await sequelize.transaction();

  try {
    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    await Evaluation_PACE.destroy({
      where: { idPACE: evaluationId },
      transaction: t,
    });

    await evaluation.destroy({ transaction: t });
    await t.commit();

    res.status(200).json({ message: "Evaluation deleted" });
  } catch (error: any) {
    await t.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error deleting evaluation" });
  }
  return res;
};

exports.searchPatients = async (req: Request, res: Response) => {
  try {
    const { term } = req.query;

    const patients = await Patient.findAll({
      where: {
        [Op.or]: [
          { firstname: { [Op.iLike]: `%${term}%` } },
          { lastname: { [Op.iLike]: `%${term}%` } },
        ],
      },
    });

    res.status(200).json(patients);
  } catch (error) {
    console.error("Erreur lors de la recherche de patients:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la recherche de patients" });
  }
};
