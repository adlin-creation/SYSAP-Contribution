import { Request, Response } from "express";
import { Evaluation } from "../model/Evaluation";
import { Evaluation_PACE } from "../model/Evaluation_PACE";
import { sequelize } from "../util/database";

exports.createEvaluation = async (req: any, res: any, next: any) => {
  const {
    //idPatient,
    //idKinesiologist,
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
    const evaluation = await Evaluation.create(
      {
        //idPatient,
        //idKinesiologist,
        idResultProgram: scores.programme,
      },
      { transaction: t }
    );

    const vitesse = walkingTime ? 4 / parseFloat(walkingTime) : 0;
    let objectifMarche = 1; // 10 min par défaut
    if (vitesse >= 0.8) objectifMarche = 4; // 30 min
    else if (vitesse > 0.6) objectifMarche = 3; // 20 min
    else if (vitesse >= 0.4) objectifMarche = 2; // 15 min

    await Evaluation_PACE.create(
      {
        // Section A
        idPACE: evaluation.id,
        chairTestSupport: chairTestSupport === "with",
        chairTestCount: parseInt(chairTestCount),
        scoreA: scores.cardioMusculaire,
        // Section B
        balanceFeetTogether: parseFloat(balanceFeetTogether),
        balanceSemiTandem: parseFloat(balanceSemiTandem),
        balanceTandem: parseFloat(balanceTandem),
        balanceOneFooted: parseFloat(balanceOneFooted),
        scoreB: scores.equilibre,
        // Section C
        frtSitting: frtPosition === "sitting",
        frtDistance: parseFloat(frtDistance),
        scoreC: scores.mobilite,
        // Scores et vitesse
        scoreTotal: scores.total,
        vitesseDeMarche: vitesse,
        objectifMarche: objectifMarche,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ evaluation, scores, objectifMarche });
  } catch (error: any) {
    await t.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error creating evaluation" });
  }
  return res;
};

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

    const vitesse = walkingTime ? 4 / parseFloat(walkingTime) : 0;
    let objectifMarche = 1;
    if (vitesse >= 0.8) objectifMarche = 4;
    else if (vitesse > 0.6) objectifMarche = 3;
    else if (vitesse >= 0.4) objectifMarche = 2;

    // Update PACE evaluation

    await paceEvaluation.update(
      {
        chairTestSupport: chairTestSupport,
        chairTestCount: parseInt(chairTestCount),
        scoreA: scores.cardioMusculaire,
        balanceFeetTogether: parseFloat(balanceFeetTogether),
        balanceSemiTandem: parseFloat(balanceSemiTandem),
        balanceTandem: parseFloat(balanceTandem),
        balanceOneFooted: parseFloat(balanceOneFooted),
        scoreB: scores.equilibre,
        frtSitting: frtPosition === true,
        frtDistance: parseFloat(frtDistance || "0"),
        scoreC: scores.mobilite,
        scoreTotal: scores.total,
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
    });
  } catch (error: any) {
    await t.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error updating evaluation" });
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
