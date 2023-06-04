/*
  Warnings:

  - Made the column `start` on table `Aufgaben` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Aufgaben" ALTER COLUMN "start" SET NOT NULL;
