CREATE TABLE "Program" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" VARCHAR(255) NOT NULL,
    "duration" INTEGER NOT NULL,
    "duration_unit" VARCHAR(10) NOT NULL CHECK ("duration_unit" IN ('days', 'weeks')),
    "image" VARCHAR(255) NULL,
    "actif" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE "ProgramPhase_Program" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "rank" INTEGER NOT NULL,
    "ProgramId" INTEGER NOT NULL REFERENCES "Program" ("id") ON DELETE RESTRICT,
    "ProgramPhaseId" INTEGER NOT NULL REFERENCES "ProgramPhase" ("id") ON DELETE RESTRICT
);

CREATE TABLE "ProgramPhase" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "startConditionType" VARCHAR(255) NOT NULL CHECK ("startConditionType" IN ('TimeElapsed', 'PerformanceGoal')),
    "startConditionValue" INTEGER NOT NULL,
    "endConditionType" VARCHAR(255) NOT NULL CHECK ("endConditionType" IN ('TimeElapsed', 'PerformanceGoal')),
    "endConditionValue" INTEGER NOT NULL,
    "frequency" INTEGER NOT NULL,
    "isActive" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "Phase_Cycle" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "numberOfRepetition" INTEGER,
    "ProgramPhaseId" INTEGER NOT NULL REFERENCES "ProgramPhase" ("id") ON DELETE RESTRICT,
    "WeeklyCycleId" INTEGER NOT NULL REFERENCES "WeeklyCycle" ("id") ON DELETE RESTRICT
);

CREATE TABLE "WeeklyCycle" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" VARCHAR(255),
    "isSessionsFlexible" BOOLEAN
);

CREATE TABLE "SessionDay" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "weekDay" VARCHAR(255) NOT NULL CHECK ("weekDay" IN ('DAY_ONE', 'DAY_TWO', 'DAY_THREE', 'DAY_FOUR', 'DAY_FIVE', 'DAY_SIX', 'DAY_SEVEN')),
    "WeeklyCycleId" INTEGER NOT NULL REFERENCES "WeeklyCycle" ("id") ON DELETE RESTRICT,
    "SessionId" INTEGER NOT NULL REFERENCES "Session" ("id") ON DELETE RESTRICT
);

CREATE TABLE "Session" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" VARCHAR(255) NOT NULL,
    "constraints" VARCHAR(255)
);

CREATE TABLE "Bloc_Session" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "rank" INTEGER NOT NULL,
    "required" BOOLEAN,
    "dayTime" VARCHAR(255) NOT NULL CHECK ("dayTime" IN ('MORNING', 'AFTERNOON', 'EVENING', 'NIGHT', 'NOT APPLICABLE')),
    "SessionId" INTEGER NOT NULL REFERENCES "Session" ("id") ON DELETE RESTRICT,
    "BlocId" INTEGER NOT NULL REFERENCES "Bloc" ("id") ON DELETE RESTRICT
);

CREATE TABLE "Bloc" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" VARCHAR(255)
);

CREATE TABLE "Exercise" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" VARCHAR(255),
    "instructionalVideo" VARCHAR(255),
    "imageUrl" VARCHAR(255),
    "isSeating" BOOLEAN NOT NULL,
    "category" VARCHAR(255) NOT NULL CHECK ("category" IN ('AEROBIC', 'STRENGHT', 'ENDURANCE', 'FLEXIBILITY')),
    "targetAgeRange" VARCHAR(255) NOT NULL CHECK ("targetAgeRange" IN ('FIFTY_TO_FIFTY_NINE', 'SIXTY_TO_SIXTY_NINE', 'SEVENTY_TO_SEVENTY_NINE', 'EIGHTY_TO_EIGHTY_NINE')),
    "fitnessLevel" VARCHAR(255) NOT NULL CHECK ("fitnessLevel" IN ('LOW', 'BELOW_AVERAGE', 'AVERAGE', 'ABOVE_AVERAGE', 'HIGH'))
);

CREATE TABLE "ExerciseVersion" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "numberOfRepitions" INTEGER NOT NULL,
    "instructionalVideo" VARCHAR(255) NOT NULL
);

CREATE TABLE "Exercise_Bloc" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "rank" INTEGER,
    "required" BOOLEAN,
    "numberOfSeries" INTEGER,
    "numberOfRepetition" INTEGER,
    "restingInstruction" VARCHAR(255),
    "minutes" INTEGER,
    "ExerciseId" INTEGER NOT NULL REFERENCES "Exercise" ("id") ON DELETE RESTRICT,
    "BlocId" INTEGER NOT NULL REFERENCES "Bloc" ("id") ON DELETE RESTRICT
);

CREATE TABLE "Variant" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "level" VARCHAR(255) NOT NULL CHECK ("level" IN ('Easy', 'Difficult')),
    "ExerciseVersionId" INTEGER NOT NULL REFERENCES "ExerciseVersion" ("id") ON DELETE RESTRICT
);

CREATE TABLE "Patient" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "birthday" DATE,
    "phoneNumber" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "otherinfo" VARCHAR(255),
    "status" VARCHAR(255) NOT NULL CHECK ("status" IN ('Active', 'Paused', 'Waiting', 'Completed', 'Abort')),
    "numberOfPrograms" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "Caregiver" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "relationShip" VARCHAR(255) NOT NULL CHECK ("relationShip" IN ('Parent', 'Sibling', 'Friend', 'Other')),
    "active" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE "Patient_Caregiver" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "date" DATE NOT NULL,
    "ProgramEnrollementId" INTEGER NOT NULL REFERENCES "Program_Enrollement" ("id") ON DELETE RESTRICT,
    "CaregiverId" INTEGER NOT NULL REFERENCES "Caregiver" ("id") ON DELETE RESTRICT
);

CREATE TABLE "Program_Enrollement" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "enrollementDate" DATE NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "programEnrollementCode" VARCHAR(255) NOT NULL UNIQUE,
    "ProgramId" INTEGER NOT NULL REFERENCES "Program" ("id") ON DELETE RESTRICT,
    "PatientId" INTEGER NOT NULL REFERENCES "Patient" ("id") ON DELETE RESTRICT
);

CREATE TABLE "Professional_User" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL CHECK ("role" IN ('admin', 'doctor', 'kinesiologist')),
    "active" BOOLEAN DEFAULT TRUE
);

CREATE TABLE "Admin" (
    "idAdmin" INTEGER PRIMARY KEY REFERENCES "Professional_User" ("id") ON DELETE CASCADE,
    "key" UUID DEFAULT uuid_generate_v4()
);

CREATE TABLE "Kinesiologist" (
    "idKinesiologist" INTEGER PRIMARY KEY REFERENCES "Professional_User" ("id") ON DELETE CASCADE,
    "key" UUID DEFAULT uuid_generate_v4()
);

CREATE TABLE "Doctor" (
    "idDoctor" INTEGER PRIMARY KEY REFERENCES "Professional_User" ("id") ON DELETE CASCADE,
    "key" UUID DEFAULT uuid_generate_v4()
);

CREATE TABLE "Follow_Patient" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "active" BOOLEAN NOT NULL,
    "KinesiologistId" INTEGER REFERENCES "Kinesiologist" ("idKinesiologist") ON DELETE RESTRICT,
    "DoctorId" INTEGER REFERENCES "Doctor" ("idDoctor") ON DELETE RESTRICT,
    "ProgramEnrollementId" INTEGER REFERENCES "Program_Enrollement" ("id") ON DELETE RESTRICT
);

CREATE TABLE "Diagnostic" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "description" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,
    "DoctorId" INTEGER NOT NULL REFERENCES "Doctor" ("idDoctor") ON DELETE RESTRICT,
    "PatientId" INTEGER NOT NULL REFERENCES "Patient" ("id") ON DELETE RESTRICT
);

CREATE TABLE "SessionRecord" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "difficultyLevel" INTEGER NOT NULL,
    "painLevel" INTEGER NOT NULL CHECK ("painLevel" BETWEEN 1 AND 4),
    "walkingTime" INTEGER NOT NULL,
    "accomplishedExercice" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,
    "ProgramEnrollementId" INTEGER NOT NULL REFERENCES "Program_Enrollement" ("id") ON DELETE RESTRICT,
    "SessionId" INTEGER NOT NULL REFERENCES "Session" ("id") ON DELETE RESTRICT
);

CREATE TABLE "Alert" (
    "id" SERIAL PRIMARY KEY,
    "key" UUID DEFAULT uuid_generate_v4(),
    "statusReport" VARCHAR(255) NOT NULL CHECK ("statusReport" IN ('pending', 'resolved')),
    "date" DATE NOT NULL,
    "SessionRecordId" INTEGER REFERENCES "SessionRecord" ("id") ON DELETE SET NULL
);

ALTER TABLE "Program" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "ProgramPhase_Program" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "ProgramPhase" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Phase_Cycle" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "WeeklyCycle" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "SessionDay" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Session" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Bloc_Session" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Bloc" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Exercise" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "ExerciseVersion" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Exercise_Bloc" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Variant" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Patient" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Caregiver" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Patient_Caregiver" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Program_Enrollement" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Professional_User" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Admin" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Kinesiologist" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Doctor" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Follow_Patient" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();
ALTER TABLE "Diagnostic" ADD COLUMN "key" UUID DEFAULT uuid_generate_v4();

-- Alerte de douleur automatique

-- CREATE VIEW PainAlertView AS
-- SELECT 
--     sr1.ProgramEnrollementId,
--     sr1.date AS date1,
--     sr2.date AS date2,
--     sr3.date AS date3
-- FROM 
--     SessionRecord sr1
-- JOIN 
--     SessionRecord sr2 ON sr1.ProgramEnrollementId = sr2.ProgramEnrollementId AND sr2.date = sr1.date + INTERVAL '1 day'
-- JOIN 
--     SessionRecord sr3 ON sr2.ProgramEnrollementId = sr3.ProgramEnrollementId AND sr3.date = sr2.date + INTERVAL '1 day'
-- WHERE 
--     sr1.painLevel = 3 AND sr2.painLevel = 3 AND sr3.painLevel = 3;


