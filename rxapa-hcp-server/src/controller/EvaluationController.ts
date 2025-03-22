import { Request, Response } from "express";
import { Evaluation } from "../model/Evaluation";
import { Evaluation_PACE } from "../model/Evaluation_PACE";
import { Evaluation_PATH } from "../model/Evaluation_PATH";
import { Evaluation_MATCH } from "../model/Evaluation_MATCH";
import { sequelize } from "../util/database";
import { Patient } from "../model/Patient";
import { Program } from "../model/Program";
import { Op, Transaction } from "sequelize";

exports.createPaceEvaluation = async (req: any, res: any, next: any) => {
  console.log("Requête reçue :", req.body);
  const {
    idPatient,
    //idKinesiologist,
    chairTestSupport,
    chairTestCount,
    balanceFeetTogether,
    balanceSemiTandem,
    balanceTandem,
    balanceOneFooted,
    frtSitting,
    frtDistance,
    walkingTime,
    scores,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    const program = await Program.findOne({
      where: {
        name: scores.program,
      },
      transaction: t,
    });

    if (!program) {
      await t.rollback();
      return res.status(404).json({
        message: "Programme " + scores.program + " introuvable",
        error: `Programme '${scores.program}' introuvable`,
      });
    }

    const evaluation = await Evaluation.create(
      {
        idPatient: idPatient,
        //idKinesiologist,
        idResultProgram: program.id,
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
        frtSitting: frtSitting === "sitting",
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
    console.error("ERREUR COMPLETE SERVEUR :", error);
    await t.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({
      message: "Error creating evaluation",
      errorDetails: error.toString(),
      stack: error.stack,
    });
  }
  return res;
};

exports.createMatchEvaluation = async (req: any, res: any, next: any) => {
  console.log("Requête reçue pour évaluation MATCH:", req.body);
  const {
    idPatient,
    chairTestSupport,
    chairTestCount,
    balanceFeetTogether,
    balanceSemiTandem,
    balanceTandem,
    walkingTime,
    scores,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    const program = await Program.findOne({
      where: {
        name: scores.program,
      },
      transaction: t,
    });

    if (!program) {
      await t.rollback();
      return res.status(404).json({
        message: "Programme " + scores.program + " introuvable",
        error: `Programme '${scores.program}' introuvable`,
      });
    }

    const evaluation = await Evaluation.create(
      {
        idPatient: idPatient,
        idResultProgram: program.id,
      },
      { transaction: t }
    );

    // Convertir vitesse en nombre entier si nécessaire
    const vitesseCalculee = walkingTime ? 4 / parseFloat(walkingTime) : 0;
    // Option 1: Arrondir à 2 décimales
    const vitesse = Math.round(vitesseCalculee * 100) / 100;
    // Option 2: Si le modèle attend un entier, multiplier par 100
    // const vitesse = Math.round(vitesseCalculee * 100);

    let objectifMarche = 1; // 10 min par défaut
    if (vitesseCalculee >= 0.8) objectifMarche = 4; // 30 min
    else if (vitesseCalculee >= 0.6 && vitesseCalculee < 0.8)
      objectifMarche = 3; // 20 min
    else if (vitesseCalculee >= 0.4 && vitesseCalculee < 0.6)
      objectifMarche = 2; // 15 min

    await Evaluation_MATCH.create(
      {
        // Section Cardio-musculaire
        idPATH: evaluation.id,
        chairTestSupport: chairTestSupport === "with",
        chairTestCount: parseInt(chairTestCount),
        scoreCM: scores.cardioMusculaire,
        BalanceFeetTogether: parseFloat(balanceFeetTogether),
        balanceSemiTandem: parseFloat(balanceSemiTandem),
        balanceTandem: parseFloat(balanceTandem),
        scoreBalance: scores.equilibre,
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
    console.error("ERREUR COMPLETE SERVEUR :", error);

    await t.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({
      message: "Error creating MATCH evaluation",
      errorDetails: error.toString(),
      stack: error.stack,
    });
  }
  return res;
};

exports.createPathEvaluation = async (req: any, res: any, next: any) => {
  console.log("Requête reçue pour évaluation PATH:", req.body);
  const {
    idPatient,
    chairTestSupport,
    chairTestCount,
    balanceFeetTogether,
    balanceSemiTandem,
    balanceTandem,
    walkingTime,
    scores,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    const program = await Program.findOne({
      where: {
        name: scores.program,
      },
      transaction: t,
    });

    if (!program) {
      await t.rollback();
      return res.status(404).json({
        message: "Programme " + scores.program + " introuvable",
        error: `Programme '${scores.program}' introuvable`,
      });
    }

    const evaluation = await Evaluation.create(
      {
        idPatient: idPatient,
        idResultProgram: program.id,
      },
      { transaction: t }
    );

    const vitesse = walkingTime ? 4 / parseFloat(walkingTime) : 0;
    let objectifMarche = 1; // 10 min par défaut
    if (vitesse >= 0.8) objectifMarche = 4; // 30 min
    else if (vitesse > 0.6 && vitesse < 0.8) objectifMarche = 3; // 20 min
    else if (vitesse > 0.4 && vitesse < 0.6) objectifMarche = 2; // 15 min

    await Evaluation_PATH.create(
      {
        idPATH: evaluation.id,
        chairTestSupport: chairTestSupport === "with",
        chairTestCount: parseInt(chairTestCount),
        scoreCM: scores.cardioMusculaire,
        // Utilisez la bonne casse pour ces propriétés
        BalanceFeetTogether: parseFloat(balanceFeetTogether),
        balanceSemiTandem: parseFloat(balanceSemiTandem),
        balanceTandem: parseFloat(balanceTandem),
        scoreBalance: scores.equilibre,
        // Assurez-vous que scoreTotal est défini
        scoreTotal: scores.total,
        vitesseDeMarche: vitesse,
        objectifMarche: objectifMarche,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ evaluation, scores, objectifMarche });
  } catch (error: any) {
    console.error("ERREUR COMPLETE SERVEUR :", error);

    await t.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({
      message: "Error creating PATH evaluation",
      errorDetails: error.toString(),
      stack: error.stack,
    });
  }
  return res;
};

exports.updatePaceEvaluation = async (req: any, res: any, next: any) => {
  const evaluationId = req.params.id;
  const {
    chairTestSupport,
    chairTestCount,
    balanceFeetTogether,
    balanceSemiTandem,
    balanceTandem,
    balanceOneFooted,
    frtSitting,
    frtDistance,
    walkingTime,
    scores = {},
  } = req.body || {};

  const t = await sequelize.transaction();

  try {
    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation) {
      await t.rollback();
      return res.status(404).json({ message: "Evaluation not found" });
    }

    const paceEvaluation = await Evaluation_PACE.findByPk(evaluationId);
    if (!paceEvaluation) {
      await t.rollback();
      return res.status(404).json({ message: "PACE evaluation not found" });
    }

    const vitesse = walkingTime ? 4 / parseFloat(walkingTime) : 0;
    let objectifMarche = 1;
    if (vitesse >= 0.8) objectifMarche = 4;
    else if (vitesse > 0.6) objectifMarche = 3;
    else if (vitesse >= 0.4) objectifMarche = 2;

    await paceEvaluation.update(
      {
        chairTestSupport: chairTestSupport === "with",
        chairTestCount: parseInt(chairTestCount || "0"),
        scoreA: scores.cardioMusculaire || 0,
        balanceFeetTogether: parseFloat(balanceFeetTogether || "0"),
        balanceSemiTandem: parseFloat(balanceSemiTandem || "0"),
        balanceTandem: parseFloat(balanceTandem || "0"),
        balanceOneFooted: parseFloat(balanceOneFooted || "0"),
        scoreB: scores.equilibre || 0,
        frtSitting: frtSitting === true,
        frtDistance: parseFloat(frtDistance || "0"),
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
      message: "PACE evaluation updated successfully",
    });
  } catch (error: any) {
    await t.rollback();
    console.error("Error updating PACE evaluation:", error);

    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res.status(error.statusCode).json({
      message: "Error updating evaluation",
      errorDetails: error.toString(),
      stack: error.stack,
    });
  }
  return res;
};

exports.updateMatchEvaluation = async (req: any, res: any, next: any) => {
  const evaluationId = req.params.id;
  const {
    chairTestSupport,
    chairTestCount,
    balanceFeetTogether,
    balanceSemiTandem,
    balanceTandem,
    walkingTime,
    scores,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation) {
      await t.rollback();
      return res.status(404).json({ message: "Evaluation not found" });
    }

    const pathEvaluation = await Evaluation_MATCH.findOne({
      where: { idPATH: evaluationId },
    });

    if (!pathEvaluation) {
      await t.rollback();
      return res.status(404).json({ message: "MATCH evaluation not found" });
    }

    // Mettre à jour le programme si nécessaire
    if (scores.program) {
      const program = await Program.findOne({
        where: { name: scores.program },
        transaction: t,
      });

      if (!program) {
        await t.rollback();
        return res.status(404).json({
          message: "Programme " + scores.program + " introuvable",
        });
      }

      await evaluation.update(
        { idResultProgram: program.id },
        { transaction: t }
      );
    }

    const vitesse = walkingTime ? 4 / parseFloat(walkingTime) : 0;
    let objectifMarche = 1; // 10 min par défaut
    if (vitesse >= 0.8) objectifMarche = 4; // 30 min
    else if (vitesse >= 0.6 && vitesse < 0.8) objectifMarche = 3; // 20 min
    else if (vitesse >= 0.4 && vitesse < 0.6) objectifMarche = 2; // 15 min

    await pathEvaluation.update(
      {
        chairTestSupport: chairTestSupport === "with",
        chairTestCount: parseInt(chairTestCount),
        scoreCM: scores.cardioMusculaire,
        balanceFeetTogether: parseFloat(balanceFeetTogether),
        balanceSemiTandem: parseFloat(balanceSemiTandem),
        balanceTandem: parseFloat(balanceTandem),
        scoreBalance: scores.equilibre,
        scoreTotal: scores.total,
        vitesseDeMarche: vitesse,
        objectifMarche: objectifMarche,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(200).json({
      evaluation,
      pathEvaluation,
      scores,
      message: "MATCH evaluation updated successfully",
    });
  } catch (error: any) {
    await t.rollback();
    console.error("Error updating MATCH evaluation:", error);

    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res.status(error.statusCode).json({
      message: "Error updating MATCH evaluation",
      errorDetails: error.toString(),
      stack: error.stack,
    });
  }
  return res;
};

exports.updatePathEvaluation = async (req: any, res: any, next: any) => {
  const evaluationId = req.params.id;
  const {
    chairTestSupport,
    chairTestCount,
    balanceFeetTogether,
    balanceSemiTandem,
    balanceTandem,
    walkingTime,
    scores,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    // Vérifier si l'évaluation générale existe
    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation) {
      await t.rollback();
      return res.status(404).json({ message: "Evaluation not found" });
    }

    // Vérifier si l'évaluation PATH existe
    const pathEvaluation = await Evaluation_PATH.findOne({
      where: { idPATH: evaluationId },
    });

    if (!pathEvaluation) {
      await t.rollback();
      return res.status(404).json({ message: "PATH evaluation not found" });
    }

    // Mettre à jour le programme si nécessaire
    if (scores.program) {
      const program = await Program.findOne({
        where: { name: scores.program },
        transaction: t,
      });

      if (!program) {
        await t.rollback();
        return res.status(404).json({
          message: "Programme " + scores.program + " introuvable",
        });
      }

      await evaluation.update(
        { idResultProgram: program.id },
        { transaction: t }
      );
    }

    // Calculer la vitesse et l'objectif de marche
    const vitesse = walkingTime ? 4 / parseFloat(walkingTime) : 0;
    let objectifMarche = 1; // 10 min par défaut
    if (vitesse >= 0.8) objectifMarche = 4; // 30 min
    else if (vitesse >= 0.6 && vitesse < 0.8) objectifMarche = 3; // 20 min
    else if (vitesse >= 0.4 && vitesse < 0.6) objectifMarche = 2; // 15 min

    // Mettre à jour l'évaluation PATH
    await pathEvaluation.update(
      {
        chairTestSupport: chairTestSupport === "with",
        chairTestCount: parseInt(chairTestCount),
        scoreCM: scores.cardioMusculaire,
        balanceFeetTogether: parseFloat(balanceFeetTogether),
        balanceSemiTandem: parseFloat(balanceSemiTandem),
        balanceTandem: parseFloat(balanceTandem),
        scoreBalance: scores.equilibre,
        scoreTotal: scores.total,
        vitesseDeMarche: vitesse,
        objectifMarche: objectifMarche,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(200).json({
      evaluation,
      pathEvaluation,
      scores,
      message: "PATH evaluation updated successfully",
    });
  } catch (error: any) {
    await t.rollback();
    console.error("Error updating PATH evaluation:", error);

    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res.status(error.statusCode).json({
      message: "Error updating PATH evaluation",
      errorDetails: error.toString(),
      stack: error.stack,
    });
  }
  return res;
};

/**
 * Returns a specific PACE evaluation based on ID.
 */
exports.getPaceEvaluation = async (req: any, res: any, next: any) => {
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

exports.getMatchEvaluation = async (req: any, res: any, next: any) => {
  const evaluationId = req.params.id;
  try {
    const evaluation = await Evaluation.findOne({
      where: { id: evaluationId },
      include: [
        {
          model: Evaluation_MATCH,
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
 * Returns a specific PATH evaluation based on ID.
 */
exports.getPathEvaluation = async (req: any, res: any, next: any) => {
  const evaluationId = req.params.id;
  try {
    const evaluation = await Evaluation.findOne({
      where: { id: evaluationId },
      include: [
        {
          model: Evaluation_PATH,
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
exports.getPaceEvaluations = async (req: any, res: any, next: any) => {
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

exports.getMatchEvaluations = async (req: any, res: any, next: any) => {
  try {
    const evaluations = await Evaluation.findAll({
      include: [
        {
          model: Evaluation_MATCH,
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
 * Returns all PATH evaluations.
 */
exports.getPathEvaluations = async (req: any, res: any, next: any) => {
  try {
    const evaluations = await Evaluation.findAll({
      include: [
        {
          model: Evaluation_PATH,
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
exports.deletePaceEvaluation = async (req: any, res: any, next: any) => {
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

exports.deleteMatchEvaluation = async (req: any, res: any, next: any) => {
  const evaluationId = req.params.id;
  const t = await sequelize.transaction();

  try {
    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    await Evaluation_MATCH.destroy({
      where: { idPATH: evaluationId },
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

/**
 * Deletes a PATH evaluation.
 */
exports.deletePathEvaluation = async (req: any, res: any, next: any) => {
  const evaluationId = req.params.id;
  const t = await sequelize.transaction();

  try {
    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    await Evaluation_PATH.destroy({
      where: { idPATH: evaluationId },
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
    if (!term)
      return res.status(400).json({ message: "Terme de recherche requis" });

    // Nettoyage et séparation des termes
    const searchTerms = term.toString().trim().split(/\s+/);

    let whereClause;

    if (searchTerms.length === 1) {
      // Recherche simple sur un seul terme
      whereClause = {
        [Op.or]: [
          { firstname: { [Op.iLike]: `%${searchTerms[0]}%` } },
          { lastname: { [Op.iLike]: `%${searchTerms[0]}%` } },
        ],
      };
    } else {
      // Combinaisons prénom/nom
      whereClause = {
        [Op.or]: [
          // Format "Prénom Nom"
          {
            [Op.and]: [
              { firstname: { [Op.iLike]: `%${searchTerms[0]}%` } },
              {
                lastname: { [Op.iLike]: `%${searchTerms.slice(1).join(" ")}%` },
              },
            ],
          },
          // Format "Nom Prénom" (si deux termes)
          ...(searchTerms.length === 2
            ? [
                {
                  [Op.and]: [
                    { firstname: { [Op.iLike]: `%${searchTerms[1]}%` } },
                    { lastname: { [Op.iLike]: `%${searchTerms[0]}%` } },
                  ],
                },
              ]
            : []),
        ],
      };
    }

    const patients = await Patient.findAll({ where: whereClause });
    res.status(200).json(patients);
  } catch (error) {
    console.error("Erreur recherche:", error);
    res.status(500).json({ message: "Échec de la recherche" });
  }
};
