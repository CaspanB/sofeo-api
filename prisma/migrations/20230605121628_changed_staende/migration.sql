/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Staende` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Staende` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Staende" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Staende_name_key" ON "Staende"("name");
