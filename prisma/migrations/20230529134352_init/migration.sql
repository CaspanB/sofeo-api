-- CreateTable
CREATE TABLE "Sessions" (
    "id" INTEGER NOT NULL,
    "laeuftAb" DATE NOT NULL,
    "benutzer_id" INTEGER NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);
