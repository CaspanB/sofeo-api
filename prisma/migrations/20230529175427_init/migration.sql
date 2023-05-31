/*
  Warnings:

  - The `berechtigungen` column on the `Benutzer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `passwort` on table `Benutzer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Benutzer" ALTER COLUMN "passwort" SET NOT NULL,
DROP COLUMN "berechtigungen",
ADD COLUMN     "berechtigungen" INTEGER[];
