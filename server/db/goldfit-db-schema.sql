-- Table Program
CREATE TABLE Program (
    idProgram INTEGER PRIMARY KEY AUTOINCREMENT,
    ProgramName TEXT NOT NULL,
    ProgramDescription TEXT NOT NULL,
    ProgramDuration INTEGER NOT NULL
);

-- Table Exercise
CREATE TABLE Exercise (
    idExercise INTEGER PRIMARY KEY AUTOINCREMENT,
    ExerciseName TEXT NOT NULL,
    ExerciseDescription TEXT NOT NULL,
    ExerciseNumberRepetitionsMin INTEGER NOT NULL DEFAULT 0,
    ExerciseNumberRepetitionsMax INTEGER NOT NULL DEFAULT 0,
    ExerciseDescriptionURL TEXT
);

-- Index unique pour ExerciseName dans la table Exercise
CREATE UNIQUE INDEX IF NOT EXISTS ExerciseName_UNIQUE ON Exercise (ExerciseName);

-- Table ExerciseSeries
CREATE TABLE ExerciseSeries (
    idExerciseSeries INTEGER PRIMARY KEY AUTOINCREMENT,
    ExerciseSeriesName TEXT NOT NULL,
    ExerciseSeriesDescription TEXT
);

-- Index unique pour ExerciseSeriesName dans la table ExerciseSeries
CREATE UNIQUE INDEX IF NOT EXISTS ExerciseSeriesName_UNIQUE ON ExerciseSeries (ExerciseSeriesName);

-- Table ProgramExerciseSeries
CREATE TABLE ProgramExerciseSeries (
    ProgramExerciseSeriesId INTEGER PRIMARY KEY AUTOINCREMENT,
    ProgramId INTEGER NOT NULL,
    ExerciseSeriesId INTEGER NOT NULL,
    startDay INTEGER NOT NULL,
    endDay INTEGER NOT NULL,
    FOREIGN KEY (ProgramId) REFERENCES Program (idProgram),
    FOREIGN KEY (ExerciseSeriesId) REFERENCES ExerciseSeries (idExerciseSeries)
);

-- Table ExerciseSeriesExercise
CREATE TABLE ExerciseSeriesExercise (
    idExerciseSeriesExercise INTEGER PRIMARY KEY AUTOINCREMENT,
    ExerciseSeriesId INTEGER NOT NULL,
    ExerciseId INTEGER NOT NULL,
    ExerciseOrder INTEGER NOT NULL,
    ExerciseNumberSeriesMin INTEGER NOT NULL DEFAULT 0,
    ExerciseNumberSeriesMax INTEGER NOT NULL,
    FOREIGN KEY (ExerciseId) REFERENCES Exercise (idExercise),
    FOREIGN KEY (ExerciseSeriesId) REFERENCES ExerciseSeries (idExerciseSeries)
);

-- Table Patient
CREATE TABLE Patient (
    idPatient INTEGER PRIMARY KEY AUTOINCREMENT,
    PatientFirstName TEXT NOT NULL,
    PatientLastName TEXT NOT NULL
);

-- Table ProgramEnrollment
CREATE TABLE ProgramEnrollment (
    idProgramEnrollment INTEGER PRIMARY KEY AUTOINCREMENT,
    PatientId INTEGER NOT NULL,
    ProgramId INTEGER NOT NULL,
    ProgramEnrollmentDate DATE NOT NULL,
    ProgramStartDate DATE NOT NULL,
    ProgramEnrollmentCode TEXT NOT NULL,
    FOREIGN KEY (PatientId) REFERENCES Patient (idPatient),
    FOREIGN KEY (ProgramId) REFERENCES Program (idProgram)
);

-- Index unique pour ProgramEnrollmentCode dans la table ProgramEnrollment
CREATE UNIQUE INDEX IF NOT EXISTS ProgramEnrollmentCode_UNIQUE ON ProgramEnrollment (ProgramEnrollmentCode);

-- Table ProgramDayRecord
CREATE TABLE ProgramDayRecord (
    idProgramDayRecord INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    ProgramEnrollmentId INTEGER NOT NULL,
    FOREIGN KEY (ProgramEnrollmentId) REFERENCES ProgramEnrollment (idProgramEnrollment)
);

-- Index unique pour date dans la table ProgramDayRecord
CREATE UNIQUE INDEX IF NOT EXISTS date_UNIQUE ON ProgramDayRecord (date);

-- Table ExerciseRecord
CREATE TABLE ExerciseRecord (
    idExerciseRecord INTEGER PRIMARY KEY AUTOINCREMENT,
    numberSeries INTEGER NOT NULL DEFAULT 0,
    numberRepetitions INTEGER NOT NULL DEFAULT 0,
    ProgramDayRecordId INTEGER NOT NULL,
    ExerciseId INTEGER NOT NULL,
    FOREIGN KEY (ProgramDayRecordId) REFERENCES ProgramDayRecord (idProgramDayRecord),
    FOREIGN KEY (ExerciseId) REFERENCES Exercise (idExercise)
);


-- Insertion de données dans la table Program
INSERT INTO Program (ProgramName, ProgramDescription, ProgramDuration)
VALUES
    ('PACE', 'Ceci est le programme PACE', 60),
    ('PATH', 'Ceci est le programme PATH', 60);

-- Insertion de données dans la table Exercise
INSERT INTO Exercise (ExerciseName, ExerciseDescription, ExerciseNumberRepetitionsMin, ExerciseNumberRepetitionsMax, ExerciseDescriptionURL)
VALUES
    ('Sit-Ups', 'Ce sont des redressements assis', 10, 30, 'https://youtu.be/ojByzJhwVFE'),
    ('Lie Down', 'Pas aussi facile que ça en a lair', 40, 50, 'https://youtu.be/gyds04mi_z0'),
    ('Sleeping', 'Ne ris pas', 50, 60, 'https://youtu.be/ojByzJhwVFE');

-- Insertion de données dans la table ExerciseSeries
INSERT INTO ExerciseSeries (ExerciseSeriesName, ExerciseSeriesDescription)
VALUES
    ('Série Un', 'Composée des Exercises 1 (redressements assis) et 2 (couchés) plusieurs fois'),
    ('Série Deux', 'Composée des Exercises 1 (redressements assis) et 3 (sommeil)');
    
-- Insertion de données dans la table ProgramExerciseSeries
INSERT INTO ProgramExerciseSeries (ProgramId, ExerciseSeriesId, startDay, endDay)
VALUES
    (1, 1, 1, 60),
    (2, 2, 1, 19),
    (2, 1, 20, 39),
    (2, 3, 40, 60);

-- Insertion de données dans la table ExerciseSeriesExercise
INSERT INTO ExerciseSeriesExercise (ExerciseSeriesId, ExerciseId, ExerciseOrder, ExerciseNumberSeriesMin, ExerciseNumberSeriesMax)
VALUES
    (1, 1, 1, 2, 3),
    (1, 2, 2, 3, 4),
    (2, 1, 1, 2, 4),
    (2, 3, 2, 2, 5);

-- Insertion de données dans la table Patient
INSERT INTO Patient (PatientFirstName, PatientLastName)
VALUES
    ('Mylène', 'Aubertin'),
    ('Hafedh', 'Mili');

-- Insertion de données dans la table ProgramEnrollment
INSERT INTO ProgramEnrollment (PatientId, ProgramId, ProgramEnrollmentDate, ProgramStartDate, ProgramEnrollmentCode)
VALUES
    (1, 1, '2022-03-13', '2022-03-13', 'MAL-01'),
    (2, 2, '2022-03-14', '2022-04-01', 'HM-01');

-- Insertion de données dans la table ProgramDayRecord
INSERT INTO ProgramDayRecord (date, ProgramEnrollmentId)
VALUES
    ('2022-04-01', 2),
    ('2022-04-02', 2);

-- Insertion de données dans la table ExerciseRecord
INSERT INTO ExerciseRecord (numberSeries, numberRepetitions, ProgramDayRecordId, ExerciseId)
VALUES
    (3, 10, 1, 1),
    (2, 8, 1, 2),
    (3, 10, 2, 1),
    (2, 8, 2, 2);
