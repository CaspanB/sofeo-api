-- CreateTable
CREATE TABLE "Benutzer" (
    "id" SERIAL NOT NULL,
    "loginname" VARCHAR(50) NOT NULL,
    "passwort" VARCHAR(50),
    "berechtigungen" INTEGER NOT NULL,

    CONSTRAINT "Benutzer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Helfer" (
    "id" SERIAL NOT NULL,
    "vorname" VARCHAR(25) NOT NULL,
    "nachname" VARCHAR(25) NOT NULL,
    "geburtstag" VARCHAR(50),
    "klasse" VARCHAR(50),
    "rufname" VARCHAR(25),
    "status" INTEGER,
    "verfuegbareZeiten" VARCHAR(50)[],
    "gewuenschteAufgaben" VARCHAR(50)[],

    CONSTRAINT "Helfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lehrer" (
    "kuerzel" VARCHAR(5) NOT NULL,
    "vorname" VARCHAR(25),
    "nachname" VARCHAR(25) NOT NULL,

    CONSTRAINT "Lehrer_pkey" PRIMARY KEY ("kuerzel")
);

-- CreateTable
CREATE TABLE "Klassen" (
    "kuerzel" VARCHAR(6) NOT NULL,
    "klassenstufe" INTEGER NOT NULL,
    "klasse" VARCHAR(4) NOT NULL,
    "stand_id" VARCHAR(4),

    CONSTRAINT "Klassen_pkey" PRIMARY KEY ("kuerzel")
);

-- CreateTable
CREATE TABLE "Funkgeraete" (
    "id" VARCHAR(15) NOT NULL,
    "festid" VARCHAR(5),

    CONSTRAINT "Funkgeraete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aufgabentypen" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "beschreibung" VARCHAR(100),

    CONSTRAINT "Aufgabentypen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staende" (
    "id" SERIAL NOT NULL,
    "klasse" VARCHAR(6) NOT NULL,
    "lehrer" VARCHAR(5),
    "name" VARCHAR(25),
    "position" VARCHAR(50),

    CONSTRAINT "Staende_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materialtypen" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "anzahl" INTEGER,

    CONSTRAINT "Materialtypen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lager" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "position" VARCHAR(50),

    CONSTRAINT "Lager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aufgaben" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3),
    "dauer" INTEGER NOT NULL,
    "helfer_id" VARCHAR(4) NOT NULL,
    "aufgabentyp_id" VARCHAR(4) NOT NULL,
    "funk_id" VARCHAR(15),

    CONSTRAINT "Aufgaben_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materialien" (
    "id" SERIAL NOT NULL,
    "lager_id" VARCHAR(4) NOT NULL,
    "materialtyp_id" VARCHAR(4) NOT NULL,
    "anzahl" INTEGER,

    CONSTRAINT "Materialien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materialienausgabe" (
    "id" SERIAL NOT NULL,
    "stand_id" VARCHAR(4) NOT NULL,
    "lager_id" VARCHAR(4) NOT NULL,
    "materialtyp_id" VARCHAR(4) NOT NULL,
    "anzahl" INTEGER,

    CONSTRAINT "Materialienausgabe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mitteilungen" (
    "id" SERIAL NOT NULL,
    "mitteilung" VARCHAR(100) NOT NULL,
    "empfaenger" INTEGER NOT NULL,

    CONSTRAINT "Mitteilungen_pkey" PRIMARY KEY ("id")
);
