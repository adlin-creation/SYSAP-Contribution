import { Exercise_Bloc } from "./Exercise_Bloc";
import { Exercise } from "./Exercise";
import { Session } from "./Session";
import { ExerciseVersion } from "./ExerciseVersion";
import { Program } from "./Program";
import { ProgramPhase } from "./ProgramPhase";
import { Variant } from "./Variant";
import { Bloc } from "./Bloc";
import { WeeklyCycle } from "./WeeklyCycle";
import { Bloc_Session } from "./Bloc_Session";
import { Phase_Cycle } from "./Phase_Cycle";
import { ProgramPhase_Program } from "./ProgramPhase_Program";
import { SessionDay } from "./SessionDay";
import { SessionRecord } from "./SessionRecord";
import { Alert } from "./Alert";

import { ProgramEnrollement } from "./ProgramEnrollement";

import { Patient } from "./Patient";
import { Caregiver } from "./Caregiver";
import { Patient_Caregiver } from "./Patient_Caregiver";

import { Professional_User } from "./Professional_User";
import { Admin } from "./Admin";
import { Doctor } from "./Doctor";
import { Kinesiologist } from "./Kinesiologist";

import { Follow_Patient } from "./Follow_Patient";
import { Diagnostic } from "./Diagnostic";
import { ProgramSession } from "./ProgramSession";

import { Evaluation } from "./Evaluation";
import { Evaluation_PACE } from "./Evaluation_PACE";
import { Evaluation_PATH } from "./Evaluation_PATH";
import { Evaluation_MATCH } from "./Evaluation_MATCH";

import { CalendarSession } from "./CalendarSession";


export function createAssociations() {
  /**
   * @todo The constraints should be true for production.
   *
   * Creates super many-to-many association between Bloc and Exercise.
   * To read more about (super) many-to-many association:
   * https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/
   */
  // Bloc.belongsToMany(Exercise, {
  //   through: Exercise_Bloc,
  //   // onDelete: "RESTRICT",
  //   // foreignKey: {
  //   //   allowNull: false,
  //   // },
  // });
  // Exercise.belongsToMany(Bloc, {
  //   through: Exercise_Bloc,
  //   // onDelete: "RESTRICT",
  //   // foreignKey: {
  //   //   allowNull: false,
  //   // },
  // });

  // Evaluations
  // Evaluation <> Patient (One-to-Many)
  Evaluation.belongsTo(Patient, {
    foreignKey: "idPatient",
    onDelete: "RESTRICT",
  });
  Patient.hasMany(Evaluation, {
    foreignKey: "idPatient",
    onDelete: "RESTRICT",
  });

  // Evaluation <> Kinesiologist (One-to-Many)
  Evaluation.belongsTo(Kinesiologist, {
    foreignKey: "idKinesiologist",
    onDelete: "RESTRICT",
  });
  Kinesiologist.hasMany(Evaluation, {
    foreignKey: "idKinesiologist",
    onDelete: "RESTRICT",
  });

  // Evaluation <> Program (One-to-Many)
  Evaluation.belongsTo(Program, {
    foreignKey: "idResultProgram",
    onDelete: "RESTRICT",
  });
  Program.hasMany(Evaluation, {
    foreignKey: "idResultProgram",
    onDelete: "RESTRICT",
  });

  // Evaluation PACE
  // Evaluation <> Evaluation_PACE (One-to-One)
  Evaluation_PACE.belongsTo(Evaluation, {
    foreignKey: "idPACE",
    onDelete: "CASCADE",
  });
  Evaluation.hasOne(Evaluation_PACE, {
    foreignKey: "idPACE",
    onDelete: "CASCADE",
  });

  // Evaluation PATH
  // Evaluation <> Evaluation_PATH (One-to-One)
  Evaluation_PATH.belongsTo(Evaluation, {
    foreignKey: "idPATH",
    onDelete: "CASCADE",
  });
  Evaluation.hasOne(Evaluation_PATH, {
    foreignKey: "idPATH",
    onDelete: "CASCADE",
  });

  // Evaluation MATCH
  // Evaluation <> Evaluation_MATCH (One-to-One)
  Evaluation_MATCH.belongsTo(Evaluation, {
    foreignKey: "idMATCH",
    onDelete: "CASCADE",
  });
  Evaluation.hasOne(Evaluation_MATCH, {
    foreignKey: "idMATCH",
    onDelete: "CASCADE",
  });

  Bloc.hasMany(Exercise_Bloc, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  Exercise_Bloc.belongsTo(Bloc);
  Exercise.hasMany(Exercise_Bloc, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  Exercise_Bloc.belongsTo(Exercise);

  /**
   * Creates super many-to-many association between Session and Bloc
   */
  // Session.belongsToMany(Bloc, {
  //   through: Bloc_Session,
  //   onDelete: "RESTRICT",
  //   foreignKey: {
  //     allowNull: false,
  //   },
  // });
  // Bloc.belongsToMany(Session, {
  //   through: Bloc_Session,
  //   onDelete: "RESTRICT",
  //   foreignKey: {
  //     allowNull: false,
  //   },
  // });

  Session.hasMany(Bloc_Session, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  Bloc_Session.belongsTo(Session);
  Bloc.hasMany(Bloc_Session, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  Bloc_Session.belongsTo(Bloc);

  /**
   * Creates super many-to-many association between WeeklyCycle and Session
   */
  WeeklyCycle.hasMany(SessionDay, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  SessionDay.belongsTo(WeeklyCycle);

  Session.hasMany(SessionDay, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  SessionDay.belongsTo(Session);

  /**
   * Creates super many-to-many association between ProgramPhase and WeeklyCycle
   */
  // ProgramPhase.belongsToMany(WeeklyCycle, {
  //   through: Phase_Cycle,
  //   onDelete: "RESTRICT",
  //   foreignKey: {
  //     allowNull: false,
  //   },
  // });
  // WeeklyCycle.belongsToMany(ProgramPhase, {
  //   through: Phase_Cycle,
  //   onDelete: "RESTRICT",
  //   foreignKey: {
  //     allowNull: false,
  //   },
  // });

  ProgramPhase.hasMany(Phase_Cycle, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  Phase_Cycle.belongsTo(ProgramPhase);
  WeeklyCycle.hasMany(Phase_Cycle, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  Phase_Cycle.belongsTo(WeeklyCycle);

  /**
   * Creates super many-to-many association between Program and ProgramPhase
   */
  // Program.belongsToMany(ProgramPhase, {
  //   through: ProgramPhase_Program,
  //   onDelete: "RESTRICT",
  //   foreignKey: {
  //     allowNull: false,
  //   },
  // });
  // ProgramPhase.belongsTo(Program, {
  //   through: ProgramPhase_Program,
  //   onDelete: "RESTRICT",
  //   foreignKey: {
  //     allowNull: false,
  //   },
  // });

  Program.hasMany(ProgramPhase_Program, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  ProgramPhase_Program.belongsTo(Program);
  ProgramPhase.hasMany(ProgramPhase_Program, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  ProgramPhase_Program.belongsTo(ProgramPhase);

  /**
   * Creates many-to-many association between Exercise and ExerciseVersion.
   */
  Exercise.belongsToMany(ExerciseVersion, {
    through: Variant,
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });

  ExerciseVersion.belongsToMany(Exercise, {
    through: Variant,
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });

  // new association for ExerciseVersion and Variant

  ExerciseVersion.hasMany(Variant, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  Variant.belongsTo(ExerciseVersion);

  /**
   * Creates one-to-many association between Program and Program_Enrollement
   */
  Program.hasMany(ProgramEnrollement, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  ProgramEnrollement.belongsTo(Program);

  /**
   * Creates one-to-many association between Patient and ProgramEnrollement
   */
  Patient.hasMany(ProgramEnrollement, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  ProgramEnrollement.belongsTo(Patient);

  /**
   * Creates one-to-many association between Caregiver and Patient_Caregiver
   */
  Caregiver.hasMany(Patient_Caregiver, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  Patient_Caregiver.belongsTo(Caregiver);

  /**
   * Creates one-to-many association between Program_Enrollement and Patient_Caregiver
   */
  ProgramEnrollement.hasMany(Patient_Caregiver, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  Patient_Caregiver.belongsTo(ProgramEnrollement);

  /**
   * Creates one-to-one association between Professional_User and Admin
   */
  Professional_User.hasOne(Admin, {
    foreignKey: "idAdmin",
  });
  Admin.belongsTo(Professional_User, {
    foreignKey: "idAdmin",
  });

  /**
   * Creates one-to-one association between Professional_User and Doctor
   */
  Professional_User.hasOne(Doctor, {
    foreignKey: "idDoctor",
  });
  Doctor.belongsTo(Professional_User, {
    foreignKey: "idDoctor",
  });

  /**
   * Creates one-to-one association between Professional_User and Kinesiologist
   */
  Professional_User.hasOne(Kinesiologist, {
    foreignKey: "idKinesiologist",
  });
  Kinesiologist.belongsTo(Professional_User, {
    foreignKey: "idKinesiologist",
  });

  /**
   * Creates one-to-many association between Kinesiologist and Follow_Patient
   */
  Kinesiologist.hasMany(Follow_Patient, {
    foreignKey: "KinesiologistId",
    onDelete: "RESTRICT",
  });
  Follow_Patient.belongsTo(Kinesiologist, {
    foreignKey: "KinesiologistId",
  });

  /**
   * Creates one-to-many association between Doctor and Follow_Patient
   */
  Doctor.hasMany(Follow_Patient, {
    foreignKey: "DoctorId",
    onDelete: "RESTRICT",
  });
  Follow_Patient.belongsTo(Doctor, {
    foreignKey: "DoctorId",
  });

  /**
   * Creates one-to-many association between Program_Enrollement and Follow_Patient
   */
  ProgramEnrollement.hasMany(Follow_Patient, {
    foreignKey: "ProgramEnrollementId",
    onDelete: "RESTRICT",
  });
  Follow_Patient.belongsTo(ProgramEnrollement, {
    foreignKey: "ProgramEnrollementId",
  });

  /**
   * Creates one-to-many association between Doctor and Diagnostic
   */
  Doctor.hasMany(Diagnostic, {
    foreignKey: "DoctorId",
    onDelete: "RESTRICT",
  });
  Diagnostic.belongsTo(Doctor, {
    foreignKey: "DoctorId",
  });

  /**
   * Creates one-to-many association between Patient and Diagnostic
   */
  Patient.hasMany(Diagnostic, {
    foreignKey: "PatientId",
    onDelete: "RESTRICT",
  });
  Diagnostic.belongsTo(Patient, {
    foreignKey: "PatientId",
  });

  /**
   * Creates one-to-many association between Program_Enrollement and SessionRecord
   */
  ProgramEnrollement.hasMany(SessionRecord, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  SessionRecord.belongsTo(ProgramEnrollement);

  /**
   * Creates one-to-many association between Session and SessionRecord
   */
  Session.hasMany(SessionRecord, {
    onDelete: "RESTRICT",
    foreignKey: {
      allowNull: false,
    },
  });
  SessionRecord.belongsTo(Session);

  /**
   * Creates one-to-many association between SessionRecord and Alert
   */
  SessionRecord.hasMany(Alert, {
    onDelete: "SET NULL",
    foreignKey: {
      allowNull: true,
    },
  });
  Alert.belongsTo(SessionRecord);

  /**
   * Creates many-to-many association between Program and Session
   */

  Program.belongsToMany(Session, {
    through: ProgramSession,
    foreignKey: "programId",
    otherKey: "sessionId",
    onDelete: "CASCADE",
  });
  Session.belongsToMany(Program, {
    through: ProgramSession,
    foreignKey: "sessionId",
    otherKey: "programId",
    onDelete: "CASCADE",
  });
  // === Associations pour CalendarSession ===
CalendarSession.belongsTo(Patient, {
  foreignKey: "PatientId",
  onDelete: "CASCADE",
});

CalendarSession.belongsTo(Program, {
  foreignKey: "ProgramId",
  onDelete: "CASCADE",
});

Patient.hasMany(CalendarSession, {
  foreignKey: "PatientId",
  onDelete: "CASCADE",
});

Program.hasMany(CalendarSession, {
  foreignKey: "ProgramId",
  onDelete: "CASCADE",
});


}
