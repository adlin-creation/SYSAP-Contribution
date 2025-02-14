--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Postgres.app)
-- Dumped by pg_dump version 16.4

-- Started on 2024-11-20 10:13:34 EST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 963 (class 1247 OID 16714)
-- Name: enum_Alerts_statusReport; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_Alerts_statusReport" AS ENUM (
    'pending',
    'resolved'
);


ALTER TYPE public."enum_Alerts_statusReport" OWNER TO adminadmin;

--
-- TOC entry 933 (class 1247 OID 16547)
-- Name: enum_Bloc_Sessions_dayTime; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_Bloc_Sessions_dayTime" AS ENUM (
    'MORNING',
    'AFTERNOON',
    'EVENING',
    'NIGHT',
    'NOT APPLICABLE'
);


ALTER TYPE public."enum_Bloc_Sessions_dayTime" OWNER TO adminadmin;

--
-- TOC entry 969 (class 1247 OID 16732)
-- Name: enum_Caregivers_relationShip; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_Caregivers_relationShip" AS ENUM (
    'Parent',
    'Sibling',
    'Friend',
    'Other'
);


ALTER TYPE public."enum_Caregivers_relationShip" OWNER TO adminadmin;

--
-- TOC entry 891 (class 1247 OID 16402)
-- Name: enum_Exercises_category; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_Exercises_category" AS ENUM (
    'AEROBIC',
    'STRENGHT',
    'ENDURANCE',
    'FLEXIBILITY'
);


ALTER TYPE public."enum_Exercises_category" OWNER TO adminadmin;

--
-- TOC entry 897 (class 1247 OID 16422)
-- Name: enum_Exercises_fitnessLevel; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_Exercises_fitnessLevel" AS ENUM (
    'LOW',
    'BELOW_AVERAGE',
    'AVERAGE',
    'ABOVE_AVERAGE',
    'HIGH'
);


ALTER TYPE public."enum_Exercises_fitnessLevel" OWNER TO adminadmin;

--
-- TOC entry 894 (class 1247 OID 16412)
-- Name: enum_Exercises_targetAgeRange; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_Exercises_targetAgeRange" AS ENUM (
    'FIFTY_TO_FIFTY_NINE',
    'SIXTY_TO_SIXTY_NINE',
    'SEVENTY_TO_SEVENTY_NINE',
    'EIGHTY_TO_EIGHTY_NINE'
);


ALTER TYPE public."enum_Exercises_targetAgeRange" OWNER TO adminadmin;

--
-- TOC entry 954 (class 1247 OID 16654)
-- Name: enum_Patients_status; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_Patients_status" AS ENUM (
    'Active',
    'Paused',
    'Waiting',
    'Completed',
    'Abort'
);


ALTER TYPE public."enum_Patients_status" OWNER TO adminadmin;

--
-- TOC entry 978 (class 1247 OID 16771)
-- Name: enum_Professional_Users_role; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_Professional_Users_role" AS ENUM (
    'admin',
    'doctor',
    'kinesiologist'
);


ALTER TYPE public."enum_Professional_Users_role" OWNER TO adminadmin;

--
-- TOC entry 918 (class 1247 OID 16500)
-- Name: enum_ProgramPhases_endConditionType; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_ProgramPhases_endConditionType" AS ENUM (
    'TimeElapsed',
    'PerformanceGoal'
);


ALTER TYPE public."enum_ProgramPhases_endConditionType" OWNER TO adminadmin;

--
-- TOC entry 915 (class 1247 OID 16495)
-- Name: enum_ProgramPhases_startConditionType; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_ProgramPhases_startConditionType" AS ENUM (
    'TimeElapsed',
    'PerformanceGoal'
);


ALTER TYPE public."enum_ProgramPhases_startConditionType" OWNER TO adminadmin;

--
-- TOC entry 945 (class 1247 OID 16609)
-- Name: enum_SessionDays_weekDay; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_SessionDays_weekDay" AS ENUM (
    'DAY_ONE',
    'DAY_TWO',
    'DAY_THREE',
    'DAY_FOUR',
    'DAY_FIVE',
    'DAY_SIX',
    'DAY_SEVEN'
);


ALTER TYPE public."enum_SessionDays_weekDay" OWNER TO adminadmin;

--
-- TOC entry 924 (class 1247 OID 16516)
-- Name: enum_Variants_level; Type: TYPE; Schema: public; Owner: adminadmin
--

CREATE TYPE public."enum_Variants_level" AS ENUM (
    'Easy',
    'Difficult'
);


ALTER TYPE public."enum_Variants_level" OWNER TO adminadmin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 253 (class 1259 OID 16789)
-- Name: Admins; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Admins" (
    "idAdmin" integer NOT NULL,
    key uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Admins" OWNER TO adminadmin;

--
-- TOC entry 248 (class 1259 OID 16720)
-- Name: Alerts; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Alerts" (
    id integer NOT NULL,
    key uuid,
    "statusReport" public."enum_Alerts_statusReport" NOT NULL,
    date timestamp with time zone NOT NULL,
    "SessionRecordId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Alerts" OWNER TO adminadmin;

--
-- TOC entry 247 (class 1259 OID 16719)
-- Name: Alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Alerts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Alerts_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3898 (class 0 OID 0)
-- Dependencies: 247
-- Name: Alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Alerts_id_seq" OWNED BY public."Alerts".id;


--
-- TOC entry 234 (class 1259 OID 16558)
-- Name: Bloc_Sessions; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Bloc_Sessions" (
    id integer NOT NULL,
    key uuid,
    rank integer NOT NULL,
    required boolean,
    "dayTime" public."enum_Bloc_Sessions_dayTime" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "SessionId" integer NOT NULL,
    "BlocId" integer NOT NULL
);


ALTER TABLE public."Bloc_Sessions" OWNER TO adminadmin;

--
-- TOC entry 233 (class 1259 OID 16557)
-- Name: Bloc_Sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Bloc_Sessions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Bloc_Sessions_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3899 (class 0 OID 0)
-- Dependencies: 233
-- Name: Bloc_Sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Bloc_Sessions_id_seq" OWNED BY public."Bloc_Sessions".id;


--
-- TOC entry 216 (class 1259 OID 16391)
-- Name: Blocs; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Blocs" (
    id integer NOT NULL,
    key uuid,
    name character varying(255) NOT NULL,
    description character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Blocs" OWNER TO adminadmin;

--
-- TOC entry 215 (class 1259 OID 16390)
-- Name: Blocs_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Blocs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Blocs_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3900 (class 0 OID 0)
-- Dependencies: 215
-- Name: Blocs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Blocs_id_seq" OWNED BY public."Blocs".id;


--
-- TOC entry 250 (class 1259 OID 16742)
-- Name: Caregivers; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Caregivers" (
    id integer NOT NULL,
    firstname character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    "phoneNumber" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    "relationShip" public."enum_Caregivers_relationShip" NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Caregivers" OWNER TO adminadmin;

--
-- TOC entry 249 (class 1259 OID 16741)
-- Name: Caregivers_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Caregivers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Caregivers_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3901 (class 0 OID 0)
-- Dependencies: 249
-- Name: Caregivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Caregivers_id_seq" OWNED BY public."Caregivers".id;


--
-- TOC entry 263 (class 1259 OID 16954)
-- Name: Diagnostics; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Diagnostics" (
    id integer NOT NULL,
    key uuid,
    description character varying(255) NOT NULL,
    date timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "DoctorId" integer,
    "PatientId" integer
);


ALTER TABLE public."Diagnostics" OWNER TO adminadmin;

--
-- TOC entry 262 (class 1259 OID 16953)
-- Name: Diagnostics_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Diagnostics_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Diagnostics_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3902 (class 0 OID 0)
-- Dependencies: 262
-- Name: Diagnostics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Diagnostics_id_seq" OWNED BY public."Diagnostics".id;


--
-- TOC entry 258 (class 1259 OID 16891)
-- Name: Doctors; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Doctors" (
    "idDoctor" integer NOT NULL,
    key uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Doctors" OWNER TO adminadmin;

--
-- TOC entry 224 (class 1259 OID 16473)
-- Name: ExerciseVersions; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."ExerciseVersions" (
    id integer NOT NULL,
    key uuid,
    name character varying(255) NOT NULL,
    "numberOfRepitions" integer NOT NULL,
    "instructionalVideo" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ExerciseVersions" OWNER TO adminadmin;

--
-- TOC entry 223 (class 1259 OID 16472)
-- Name: ExerciseVersions_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."ExerciseVersions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ExerciseVersions_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3903 (class 0 OID 0)
-- Dependencies: 223
-- Name: ExerciseVersions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."ExerciseVersions_id_seq" OWNED BY public."ExerciseVersions".id;


--
-- TOC entry 220 (class 1259 OID 16445)
-- Name: Exercise_Blocs; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Exercise_Blocs" (
    id integer NOT NULL,
    key uuid,
    rank integer,
    required boolean,
    "numberOfSeries" integer,
    "numberOfRepetition" integer,
    "restingInstruction" character varying(255),
    minutes integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "BlocId" integer NOT NULL,
    "ExerciseId" integer NOT NULL
);


ALTER TABLE public."Exercise_Blocs" OWNER TO adminadmin;

--
-- TOC entry 219 (class 1259 OID 16444)
-- Name: Exercise_Blocs_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Exercise_Blocs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Exercise_Blocs_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3904 (class 0 OID 0)
-- Dependencies: 219
-- Name: Exercise_Blocs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Exercise_Blocs_id_seq" OWNED BY public."Exercise_Blocs".id;


--
-- TOC entry 218 (class 1259 OID 16434)
-- Name: Exercises; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Exercises" (
    id integer NOT NULL,
    key uuid,
    name character varying(255) NOT NULL,
    description character varying(255),
    "instructionalVideo" character varying(255),
    "imageUrl" character varying(255),
    "isSeating" boolean NOT NULL,
    category public."enum_Exercises_category" NOT NULL,
    "targetAgeRange" public."enum_Exercises_targetAgeRange" NOT NULL,
    "fitnessLevel" public."enum_Exercises_fitnessLevel" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Exercises" OWNER TO adminadmin;

--
-- TOC entry 217 (class 1259 OID 16433)
-- Name: Exercises_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Exercises_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Exercises_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3905 (class 0 OID 0)
-- Dependencies: 217
-- Name: Exercises_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Exercises_id_seq" OWNED BY public."Exercises".id;


--
-- TOC entry 255 (class 1259 OID 16820)
-- Name: Follow_Patients; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Follow_Patients" (
    id integer NOT NULL,
    key uuid,
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone NOT NULL,
    active boolean NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "KinesiologistId" integer,
    "DoctorId" integer,
    "ProgramEnrollementId" integer
);


ALTER TABLE public."Follow_Patients" OWNER TO adminadmin;

--
-- TOC entry 254 (class 1259 OID 16819)
-- Name: Follow_Patients_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Follow_Patients_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Follow_Patients_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3906 (class 0 OID 0)
-- Dependencies: 254
-- Name: Follow_Patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Follow_Patients_id_seq" OWNED BY public."Follow_Patients".id;


--
-- TOC entry 259 (class 1259 OID 16901)
-- Name: Kinesiologists; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Kinesiologists" (
    "idKinesiologist" integer NOT NULL,
    key uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Kinesiologists" OWNER TO adminadmin;

--
-- TOC entry 252 (class 1259 OID 16754)
-- Name: Patient_Caregivers; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Patient_Caregivers" (
    id integer NOT NULL,
    date timestamp with time zone NOT NULL,
    "ProgramEnrollementId" integer NOT NULL,
    "CaregiverId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Patient_Caregivers" OWNER TO adminadmin;

--
-- TOC entry 251 (class 1259 OID 16753)
-- Name: Patient_Caregivers_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Patient_Caregivers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Patient_Caregivers_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3907 (class 0 OID 0)
-- Dependencies: 251
-- Name: Patient_Caregivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Patient_Caregivers_id_seq" OWNED BY public."Patient_Caregivers".id;


--
-- TOC entry 261 (class 1259 OID 16942)
-- Name: Patients; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Patients" (
    id integer NOT NULL,
    firstname character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    birthday timestamp with time zone,
    "phoneNumber" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    otherinfo character varying(255),
    status public."enum_Patients_status" NOT NULL,
    "numberOfPrograms" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Patients" OWNER TO adminadmin;

--
-- TOC entry 260 (class 1259 OID 16941)
-- Name: Patients_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Patients_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Patients_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3908 (class 0 OID 0)
-- Dependencies: 260
-- Name: Patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Patients_id_seq" OWNED BY public."Patients".id;


--
-- TOC entry 236 (class 1259 OID 16575)
-- Name: Phase_Cycles; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Phase_Cycles" (
    id integer NOT NULL,
    key uuid,
    "numberOfRepetition" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ProgramPhaseId" integer NOT NULL,
    "WeeklyCycleId" integer NOT NULL
);


ALTER TABLE public."Phase_Cycles" OWNER TO adminadmin;

--
-- TOC entry 235 (class 1259 OID 16574)
-- Name: Phase_Cycles_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Phase_Cycles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Phase_Cycles_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3909 (class 0 OID 0)
-- Dependencies: 235
-- Name: Phase_Cycles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Phase_Cycles_id_seq" OWNED BY public."Phase_Cycles".id;


--
-- TOC entry 257 (class 1259 OID 16880)
-- Name: Professional_Users; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Professional_Users" (
    id integer NOT NULL,
    key uuid,
    firstname character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    "phoneNumber" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public."enum_Professional_Users_role" NOT NULL,
    active boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Professional_Users" OWNER TO adminadmin;

--
-- TOC entry 256 (class 1259 OID 16879)
-- Name: Professional_Users_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Professional_Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Professional_Users_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3910 (class 0 OID 0)
-- Dependencies: 256
-- Name: Professional_Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Professional_Users_id_seq" OWNED BY public."Professional_Users".id;


--
-- TOC entry 238 (class 1259 OID 16592)
-- Name: ProgramPhase_Programs; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."ProgramPhase_Programs" (
    id integer NOT NULL,
    key uuid,
    rank integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ProgramId" integer NOT NULL,
    "ProgramPhaseId" integer NOT NULL
);


ALTER TABLE public."ProgramPhase_Programs" OWNER TO adminadmin;

--
-- TOC entry 237 (class 1259 OID 16591)
-- Name: ProgramPhase_Programs_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."ProgramPhase_Programs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProgramPhase_Programs_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3911 (class 0 OID 0)
-- Dependencies: 237
-- Name: ProgramPhase_Programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."ProgramPhase_Programs_id_seq" OWNED BY public."ProgramPhase_Programs".id;


--
-- TOC entry 228 (class 1259 OID 16506)
-- Name: ProgramPhases; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."ProgramPhases" (
    id integer NOT NULL,
    key uuid,
    name character varying(255) NOT NULL,
    "startConditionType" public."enum_ProgramPhases_startConditionType" NOT NULL,
    "startConditionValue" integer NOT NULL,
    "endConditionType" public."enum_ProgramPhases_endConditionType" NOT NULL,
    "endConditionValue" integer NOT NULL,
    frequency integer NOT NULL,
    "isActive" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ProgramPhases" OWNER TO adminadmin;

--
-- TOC entry 227 (class 1259 OID 16505)
-- Name: ProgramPhases_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."ProgramPhases_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProgramPhases_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3912 (class 0 OID 0)
-- Dependencies: 227
-- Name: ProgramPhases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."ProgramPhases_id_seq" OWNED BY public."ProgramPhases".id;


--
-- TOC entry 244 (class 1259 OID 16678)
-- Name: Program_Enrollements; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Program_Enrollements" (
    id integer NOT NULL,
    key uuid,
    "enrollementDate" timestamp with time zone NOT NULL,
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone NOT NULL,
    "programEnrollementCode" character varying(255) NOT NULL,
    "ProgramId" integer NOT NULL,
    "PatientId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Program_Enrollements" OWNER TO adminadmin;

--
-- TOC entry 243 (class 1259 OID 16677)
-- Name: Program_Enrollements_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Program_Enrollements_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Program_Enrollements_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3913 (class 0 OID 0)
-- Dependencies: 243
-- Name: Program_Enrollements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Program_Enrollements_id_seq" OWNED BY public."Program_Enrollements".id;


--
-- TOC entry 226 (class 1259 OID 16484)
-- Name: Programs; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Programs" (
    id SERIAL PRIMARY KEY,
    key uuid,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    duration integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Programs" OWNER TO adminadmin;

--
-- TOC entry 225 (class 1259 OID 16483)
-- Name: Programs_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Programs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Programs_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3914 (class 0 OID 0)
-- Dependencies: 225
-- Name: Programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Programs_id_seq" OWNED BY public."Programs".id;


--
-- TOC entry 240 (class 1259 OID 16624)
-- Name: SessionDays; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."SessionDays" (
    id integer NOT NULL,
    key uuid,
    "weekDay" public."enum_SessionDays_weekDay",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "WeeklyCycleId" integer NOT NULL,
    "SessionId" integer NOT NULL
);


ALTER TABLE public."SessionDays" OWNER TO adminadmin;

--
-- TOC entry 239 (class 1259 OID 16623)
-- Name: SessionDays_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."SessionDays_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SessionDays_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3915 (class 0 OID 0)
-- Dependencies: 239
-- Name: SessionDays_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."SessionDays_id_seq" OWNED BY public."SessionDays".id;


--
-- TOC entry 246 (class 1259 OID 16697)
-- Name: SessionRecords; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."SessionRecords" (
    id integer NOT NULL,
    key uuid,
    "difficultyLevel" integer NOT NULL,
    "painLevel" integer NOT NULL,
    "walkingTime" integer NOT NULL,
    "accomplishedExercice" character varying(255) NOT NULL,
    date timestamp with time zone NOT NULL,
    "ProgramEnrollementId" integer NOT NULL,
    "SessionId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."SessionRecords" OWNER TO adminadmin;

--
-- TOC entry 245 (class 1259 OID 16696)
-- Name: SessionRecords_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."SessionRecords_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SessionRecords_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3916 (class 0 OID 0)
-- Dependencies: 245
-- Name: SessionRecords_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."SessionRecords_id_seq" OWNED BY public."SessionRecords".id;


--
-- TOC entry 222 (class 1259 OID 16462)
-- Name: Sessions; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Sessions" (
    id integer NOT NULL,
    key uuid,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    constraints character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Sessions" OWNER TO adminadmin;

--
-- TOC entry 221 (class 1259 OID 16461)
-- Name: Sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Sessions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Sessions_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3917 (class 0 OID 0)
-- Dependencies: 221
-- Name: Sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Sessions_id_seq" OWNED BY public."Sessions".id;


--
-- TOC entry 242 (class 1259 OID 16641)
-- Name: Users; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    key uuid,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO adminadmin;

--
-- TOC entry 241 (class 1259 OID 16640)
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3918 (class 0 OID 0)
-- Dependencies: 241
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- TOC entry 230 (class 1259 OID 16522)
-- Name: Variants; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."Variants" (
    id integer NOT NULL,
    key uuid,
    level public."enum_Variants_level" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    undefined integer NOT NULL
);


ALTER TABLE public."Variants" OWNER TO adminadmin;

--
-- TOC entry 229 (class 1259 OID 16521)
-- Name: Variants_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."Variants_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Variants_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3919 (class 0 OID 0)
-- Dependencies: 229
-- Name: Variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."Variants_id_seq" OWNED BY public."Variants".id;


--
-- TOC entry 232 (class 1259 OID 16536)
-- Name: WeeklyCycles; Type: TABLE; Schema: public; Owner: adminadmin
--

CREATE TABLE public."WeeklyCycles" (
    id integer NOT NULL,
    key uuid,
    name character varying(255) NOT NULL,
    description character varying(255),
    "isSessionsFlexible" boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."WeeklyCycles" OWNER TO adminadmin;

--
-- TOC entry 231 (class 1259 OID 16535)
-- Name: WeeklyCycles_id_seq; Type: SEQUENCE; Schema: public; Owner: adminadmin
--

CREATE SEQUENCE public."WeeklyCycles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WeeklyCycles_id_seq" OWNER TO adminadmin;

--
-- TOC entry 3920 (class 0 OID 0)
-- Dependencies: 231
-- Name: WeeklyCycles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adminadmin
--

ALTER SEQUENCE public."WeeklyCycles_id_seq" OWNED BY public."WeeklyCycles".id;


--
-- TOC entry 3640 (class 2604 OID 16723)
-- Name: Alerts id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Alerts" ALTER COLUMN id SET DEFAULT nextval('public."Alerts_id_seq"'::regclass);


--
-- TOC entry 3633 (class 2604 OID 16561)
-- Name: Bloc_Sessions id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Bloc_Sessions" ALTER COLUMN id SET DEFAULT nextval('public."Bloc_Sessions_id_seq"'::regclass);


--
-- TOC entry 3623 (class 2604 OID 16394)
-- Name: Blocs id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Blocs" ALTER COLUMN id SET DEFAULT nextval('public."Blocs_id_seq"'::regclass);


--
-- TOC entry 3641 (class 2604 OID 16745)
-- Name: Caregivers id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Caregivers" ALTER COLUMN id SET DEFAULT nextval('public."Caregivers_id_seq"'::regclass);


--
-- TOC entry 3649 (class 2604 OID 16957)
-- Name: Diagnostics id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Diagnostics" ALTER COLUMN id SET DEFAULT nextval('public."Diagnostics_id_seq"'::regclass);


--
-- TOC entry 3627 (class 2604 OID 16476)
-- Name: ExerciseVersions id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."ExerciseVersions" ALTER COLUMN id SET DEFAULT nextval('public."ExerciseVersions_id_seq"'::regclass);


--
-- TOC entry 3625 (class 2604 OID 16448)
-- Name: Exercise_Blocs id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Exercise_Blocs" ALTER COLUMN id SET DEFAULT nextval('public."Exercise_Blocs_id_seq"'::regclass);


--
-- TOC entry 3624 (class 2604 OID 16437)
-- Name: Exercises id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Exercises" ALTER COLUMN id SET DEFAULT nextval('public."Exercises_id_seq"'::regclass);


--
-- TOC entry 3644 (class 2604 OID 16823)
-- Name: Follow_Patients id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Follow_Patients" ALTER COLUMN id SET DEFAULT nextval('public."Follow_Patients_id_seq"'::regclass);


--
-- TOC entry 3643 (class 2604 OID 16757)
-- Name: Patient_Caregivers id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Patient_Caregivers" ALTER COLUMN id SET DEFAULT nextval('public."Patient_Caregivers_id_seq"'::regclass);


--
-- TOC entry 3647 (class 2604 OID 16945)
-- Name: Patients id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Patients" ALTER COLUMN id SET DEFAULT nextval('public."Patients_id_seq"'::regclass);


--
-- TOC entry 3634 (class 2604 OID 16578)
-- Name: Phase_Cycles id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Phase_Cycles" ALTER COLUMN id SET DEFAULT nextval('public."Phase_Cycles_id_seq"'::regclass);


--
-- TOC entry 3645 (class 2604 OID 16883)
-- Name: Professional_Users id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Professional_Users" ALTER COLUMN id SET DEFAULT nextval('public."Professional_Users_id_seq"'::regclass);


--
-- TOC entry 3635 (class 2604 OID 16595)
-- Name: ProgramPhase_Programs id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."ProgramPhase_Programs" ALTER COLUMN id SET DEFAULT nextval('public."ProgramPhase_Programs_id_seq"'::regclass);


--
-- TOC entry 3629 (class 2604 OID 16509)
-- Name: ProgramPhases id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."ProgramPhases" ALTER COLUMN id SET DEFAULT nextval('public."ProgramPhases_id_seq"'::regclass);


--
-- TOC entry 3638 (class 2604 OID 16681)
-- Name: Program_Enrollements id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Program_Enrollements" ALTER COLUMN id SET DEFAULT nextval('public."Program_Enrollements_id_seq"'::regclass);


--
-- TOC entry 3628 (class 2604 OID 16487)
-- Name: Programs id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Programs" ALTER COLUMN id SET DEFAULT nextval('public."Programs_id_seq"'::regclass);


--
-- TOC entry 3636 (class 2604 OID 16627)
-- Name: SessionDays id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."SessionDays" ALTER COLUMN id SET DEFAULT nextval('public."SessionDays_id_seq"'::regclass);


--
-- TOC entry 3639 (class 2604 OID 16700)
-- Name: SessionRecords id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."SessionRecords" ALTER COLUMN id SET DEFAULT nextval('public."SessionRecords_id_seq"'::regclass);


--
-- TOC entry 3626 (class 2604 OID 16465)
-- Name: Sessions id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Sessions" ALTER COLUMN id SET DEFAULT nextval('public."Sessions_id_seq"'::regclass);


--
-- TOC entry 3637 (class 2604 OID 16644)
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- TOC entry 3631 (class 2604 OID 16525)
-- Name: Variants id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Variants" ALTER COLUMN id SET DEFAULT nextval('public."Variants_id_seq"'::regclass);


--
-- TOC entry 3632 (class 2604 OID 16539)
-- Name: WeeklyCycles id; Type: DEFAULT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."WeeklyCycles" ALTER COLUMN id SET DEFAULT nextval('public."WeeklyCycles_id_seq"'::regclass);


--
-- TOC entry 3711 (class 2606 OID 16793)
-- Name: Admins Admins_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Admins"
    ADD CONSTRAINT "Admins_pkey" PRIMARY KEY ("idAdmin");


--
-- TOC entry 3703 (class 2606 OID 16725)
-- Name: Alerts Alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Alerts"
    ADD CONSTRAINT "Alerts_pkey" PRIMARY KEY (id);


--
-- TOC entry 3685 (class 2606 OID 16563)
-- Name: Bloc_Sessions Bloc_Sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Bloc_Sessions"
    ADD CONSTRAINT "Bloc_Sessions_pkey" PRIMARY KEY (id);


--
-- TOC entry 3651 (class 2606 OID 16400)
-- Name: Blocs Blocs_name_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Blocs"
    ADD CONSTRAINT "Blocs_name_key" UNIQUE (name);


--
-- TOC entry 3653 (class 2606 OID 16398)
-- Name: Blocs Blocs_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Blocs"
    ADD CONSTRAINT "Blocs_pkey" PRIMARY KEY (id);


--
-- TOC entry 3705 (class 2606 OID 16752)
-- Name: Caregivers Caregivers_email_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Caregivers"
    ADD CONSTRAINT "Caregivers_email_key" UNIQUE (email);


--
-- TOC entry 3707 (class 2606 OID 16750)
-- Name: Caregivers Caregivers_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Caregivers"
    ADD CONSTRAINT "Caregivers_pkey" PRIMARY KEY (id);


--
-- TOC entry 3727 (class 2606 OID 16959)
-- Name: Diagnostics Diagnostics_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Diagnostics"
    ADD CONSTRAINT "Diagnostics_pkey" PRIMARY KEY (id);


--
-- TOC entry 3719 (class 2606 OID 16895)
-- Name: Doctors Doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_pkey" PRIMARY KEY ("idDoctor");


--
-- TOC entry 3665 (class 2606 OID 16482)
-- Name: ExerciseVersions ExerciseVersions_name_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."ExerciseVersions"
    ADD CONSTRAINT "ExerciseVersions_name_key" UNIQUE (name);


--
-- TOC entry 3667 (class 2606 OID 16480)
-- Name: ExerciseVersions ExerciseVersions_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."ExerciseVersions"
    ADD CONSTRAINT "ExerciseVersions_pkey" PRIMARY KEY (id);


--
-- TOC entry 3659 (class 2606 OID 16450)
-- Name: Exercise_Blocs Exercise_Blocs_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Exercise_Blocs"
    ADD CONSTRAINT "Exercise_Blocs_pkey" PRIMARY KEY (id);


--
-- TOC entry 3655 (class 2606 OID 16443)
-- Name: Exercises Exercises_name_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Exercises"
    ADD CONSTRAINT "Exercises_name_key" UNIQUE (name);


--
-- TOC entry 3657 (class 2606 OID 16441)
-- Name: Exercises Exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Exercises"
    ADD CONSTRAINT "Exercises_pkey" PRIMARY KEY (id);


--
-- TOC entry 3713 (class 2606 OID 16825)
-- Name: Follow_Patients Follow_Patients_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Follow_Patients"
    ADD CONSTRAINT "Follow_Patients_pkey" PRIMARY KEY (id);


--
-- TOC entry 3721 (class 2606 OID 16905)
-- Name: Kinesiologists Kinesiologists_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Kinesiologists"
    ADD CONSTRAINT "Kinesiologists_pkey" PRIMARY KEY ("idKinesiologist");


--
-- TOC entry 3709 (class 2606 OID 16759)
-- Name: Patient_Caregivers Patient_Caregivers_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Patient_Caregivers"
    ADD CONSTRAINT "Patient_Caregivers_pkey" PRIMARY KEY (id);


--
-- TOC entry 3723 (class 2606 OID 16952)
-- Name: Patients Patients_email_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Patients"
    ADD CONSTRAINT "Patients_email_key" UNIQUE (email);


--
-- TOC entry 3725 (class 2606 OID 16950)
-- Name: Patients Patients_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Patients"
    ADD CONSTRAINT "Patients_pkey" PRIMARY KEY (id);


--
-- TOC entry 3687 (class 2606 OID 16580)
-- Name: Phase_Cycles Phase_Cycles_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Phase_Cycles"
    ADD CONSTRAINT "Phase_Cycles_pkey" PRIMARY KEY (id);


--
-- TOC entry 3715 (class 2606 OID 16890)
-- Name: Professional_Users Professional_Users_email_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Professional_Users"
    ADD CONSTRAINT "Professional_Users_email_key" UNIQUE (email);


--
-- TOC entry 3717 (class 2606 OID 16888)
-- Name: Professional_Users Professional_Users_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Professional_Users"
    ADD CONSTRAINT "Professional_Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 3689 (class 2606 OID 16597)
-- Name: ProgramPhase_Programs ProgramPhase_Programs_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."ProgramPhase_Programs"
    ADD CONSTRAINT "ProgramPhase_Programs_pkey" PRIMARY KEY (id);


--
-- TOC entry 3673 (class 2606 OID 16514)
-- Name: ProgramPhases ProgramPhases_name_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."ProgramPhases"
    ADD CONSTRAINT "ProgramPhases_name_key" UNIQUE (name);


--
-- TOC entry 3675 (class 2606 OID 16512)
-- Name: ProgramPhases ProgramPhases_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."ProgramPhases"
    ADD CONSTRAINT "ProgramPhases_pkey" PRIMARY KEY (id);


--
-- TOC entry 3697 (class 2606 OID 16683)
-- Name: Program_Enrollements Program_Enrollements_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Program_Enrollements"
    ADD CONSTRAINT "Program_Enrollements_pkey" PRIMARY KEY (id);


--
-- TOC entry 3699 (class 2606 OID 16685)
-- Name: Program_Enrollements Program_Enrollements_programEnrollementCode_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Program_Enrollements"
    ADD CONSTRAINT "Program_Enrollements_programEnrollementCode_key" UNIQUE ("programEnrollementCode");


--
-- TOC entry 3669 (class 2606 OID 16493)
-- Name: Programs Programs_name_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Programs"
    ADD CONSTRAINT "Programs_name_key" UNIQUE (name);


--
-- TOC entry 3671 (class 2606 OID 16491)
-- Name: Programs Programs_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Programs"
    ADD CONSTRAINT "Programs_pkey" PRIMARY KEY (id);


--
-- TOC entry 3691 (class 2606 OID 16629)
-- Name: SessionDays SessionDays_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."SessionDays"
    ADD CONSTRAINT "SessionDays_pkey" PRIMARY KEY (id);


--
-- TOC entry 3701 (class 2606 OID 16702)
-- Name: SessionRecords SessionRecords_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."SessionRecords"
    ADD CONSTRAINT "SessionRecords_pkey" PRIMARY KEY (id);


--
-- TOC entry 3661 (class 2606 OID 16471)
-- Name: Sessions Sessions_name_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Sessions_name_key" UNIQUE (name);


--
-- TOC entry 3663 (class 2606 OID 16469)
-- Name: Sessions Sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Sessions"
    ADD CONSTRAINT "Sessions_pkey" PRIMARY KEY (id);


--
-- TOC entry 3693 (class 2606 OID 16650)
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- TOC entry 3695 (class 2606 OID 16648)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 3677 (class 2606 OID 16527)
-- Name: Variants Variants_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Variants"
    ADD CONSTRAINT "Variants_pkey" PRIMARY KEY (id);


--
-- TOC entry 3679 (class 2606 OID 16529)
-- Name: Variants Variants_undefined_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Variants"
    ADD CONSTRAINT "Variants_undefined_key" UNIQUE (undefined);


--
-- TOC entry 3681 (class 2606 OID 16545)
-- Name: WeeklyCycles WeeklyCycles_name_key; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."WeeklyCycles"
    ADD CONSTRAINT "WeeklyCycles_name_key" UNIQUE (name);


--
-- TOC entry 3683 (class 2606 OID 16543)
-- Name: WeeklyCycles WeeklyCycles_pkey; Type: CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."WeeklyCycles"
    ADD CONSTRAINT "WeeklyCycles_pkey" PRIMARY KEY (id);


--
-- TOC entry 3742 (class 2606 OID 16726)
-- Name: Alerts Alerts_SessionRecordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Alerts"
    ADD CONSTRAINT "Alerts_SessionRecordId_fkey" FOREIGN KEY ("SessionRecordId") REFERENCES public."SessionRecords"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3731 (class 2606 OID 16569)
-- Name: Bloc_Sessions Bloc_Sessions_BlocId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Bloc_Sessions"
    ADD CONSTRAINT "Bloc_Sessions_BlocId_fkey" FOREIGN KEY ("BlocId") REFERENCES public."Blocs"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3732 (class 2606 OID 16564)
-- Name: Bloc_Sessions Bloc_Sessions_SessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Bloc_Sessions"
    ADD CONSTRAINT "Bloc_Sessions_SessionId_fkey" FOREIGN KEY ("SessionId") REFERENCES public."Sessions"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3748 (class 2606 OID 16960)
-- Name: Diagnostics Diagnostics_DoctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Diagnostics"
    ADD CONSTRAINT "Diagnostics_DoctorId_fkey" FOREIGN KEY ("DoctorId") REFERENCES public."Doctors"("idDoctor") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3749 (class 2606 OID 16965)
-- Name: Diagnostics Diagnostics_PatientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Diagnostics"
    ADD CONSTRAINT "Diagnostics_PatientId_fkey" FOREIGN KEY ("PatientId") REFERENCES public."Patients"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3746 (class 2606 OID 16896)
-- Name: Doctors Doctors_idDoctor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_idDoctor_fkey" FOREIGN KEY ("idDoctor") REFERENCES public."Professional_Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3728 (class 2606 OID 16451)
-- Name: Exercise_Blocs Exercise_Blocs_BlocId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Exercise_Blocs"
    ADD CONSTRAINT "Exercise_Blocs_BlocId_fkey" FOREIGN KEY ("BlocId") REFERENCES public."Blocs"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3729 (class 2606 OID 16456)
-- Name: Exercise_Blocs Exercise_Blocs_ExerciseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Exercise_Blocs"
    ADD CONSTRAINT "Exercise_Blocs_ExerciseId_fkey" FOREIGN KEY ("ExerciseId") REFERENCES public."Exercises"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3745 (class 2606 OID 16836)
-- Name: Follow_Patients Follow_Patients_ProgramEnrollementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Follow_Patients"
    ADD CONSTRAINT "Follow_Patients_ProgramEnrollementId_fkey" FOREIGN KEY ("ProgramEnrollementId") REFERENCES public."Program_Enrollements"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3747 (class 2606 OID 16906)
-- Name: Kinesiologists Kinesiologists_idKinesiologist_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Kinesiologists"
    ADD CONSTRAINT "Kinesiologists_idKinesiologist_fkey" FOREIGN KEY ("idKinesiologist") REFERENCES public."Professional_Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3743 (class 2606 OID 16765)
-- Name: Patient_Caregivers Patient_Caregivers_CaregiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Patient_Caregivers"
    ADD CONSTRAINT "Patient_Caregivers_CaregiverId_fkey" FOREIGN KEY ("CaregiverId") REFERENCES public."Caregivers"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3744 (class 2606 OID 16760)
-- Name: Patient_Caregivers Patient_Caregivers_ProgramEnrollementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Patient_Caregivers"
    ADD CONSTRAINT "Patient_Caregivers_ProgramEnrollementId_fkey" FOREIGN KEY ("ProgramEnrollementId") REFERENCES public."Program_Enrollements"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3733 (class 2606 OID 16581)
-- Name: Phase_Cycles Phase_Cycles_ProgramPhaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Phase_Cycles"
    ADD CONSTRAINT "Phase_Cycles_ProgramPhaseId_fkey" FOREIGN KEY ("ProgramPhaseId") REFERENCES public."ProgramPhases"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3734 (class 2606 OID 16586)
-- Name: Phase_Cycles Phase_Cycles_WeeklyCycleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Phase_Cycles"
    ADD CONSTRAINT "Phase_Cycles_WeeklyCycleId_fkey" FOREIGN KEY ("WeeklyCycleId") REFERENCES public."WeeklyCycles"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3735 (class 2606 OID 16598)
-- Name: ProgramPhase_Programs ProgramPhase_Programs_ProgramId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."ProgramPhase_Programs"
    ADD CONSTRAINT "ProgramPhase_Programs_ProgramId_fkey" FOREIGN KEY ("ProgramId") REFERENCES public."Programs"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3736 (class 2606 OID 16603)
-- Name: ProgramPhase_Programs ProgramPhase_Programs_ProgramPhaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."ProgramPhase_Programs"
    ADD CONSTRAINT "ProgramPhase_Programs_ProgramPhaseId_fkey" FOREIGN KEY ("ProgramPhaseId") REFERENCES public."ProgramPhases"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3739 (class 2606 OID 16686)
-- Name: Program_Enrollements Program_Enrollements_ProgramId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Program_Enrollements"
    ADD CONSTRAINT "Program_Enrollements_ProgramId_fkey" FOREIGN KEY ("ProgramId") REFERENCES public."Programs"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3737 (class 2606 OID 16635)
-- Name: SessionDays SessionDays_SessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."SessionDays"
    ADD CONSTRAINT "SessionDays_SessionId_fkey" FOREIGN KEY ("SessionId") REFERENCES public."Sessions"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3738 (class 2606 OID 16630)
-- Name: SessionDays SessionDays_WeeklyCycleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."SessionDays"
    ADD CONSTRAINT "SessionDays_WeeklyCycleId_fkey" FOREIGN KEY ("WeeklyCycleId") REFERENCES public."WeeklyCycles"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3740 (class 2606 OID 16703)
-- Name: SessionRecords SessionRecords_ProgramEnrollementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."SessionRecords"
    ADD CONSTRAINT "SessionRecords_ProgramEnrollementId_fkey" FOREIGN KEY ("ProgramEnrollementId") REFERENCES public."Program_Enrollements"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3741 (class 2606 OID 16708)
-- Name: SessionRecords SessionRecords_SessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."SessionRecords"
    ADD CONSTRAINT "SessionRecords_SessionId_fkey" FOREIGN KEY ("SessionId") REFERENCES public."Sessions"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3730 (class 2606 OID 16530)
-- Name: Variants Variants_undefined_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adminadmin
--

ALTER TABLE ONLY public."Variants"
    ADD CONSTRAINT "Variants_undefined_fkey" FOREIGN KEY (undefined) REFERENCES public."Exercises"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Insert sample data into Programs table
INSERT INTO public."Programs" (key, name, description, duration, "createdAt", "updatedAt")
VALUES
    (uuid_generate_v4(), 'Programme PACE II', 'Description of Programme PACE II', 60, NOW(), NOW()),
    (uuid_generate_v4(), 'Programme Health', 'Description of Programme Health', 90, NOW(), NOW());

-- Completed on 2024-11-20 10:13:34 EST

--
-- PostgreSQL database dump complete
--

