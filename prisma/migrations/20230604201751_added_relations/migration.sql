/*
  Warnings:

  - Changed the type of `helfer_id` on the `Aufgaben` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `aufgabentyp_id` on the `Aufgaben` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lager_id` on the `Materialien` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `materialtyp_id` on the `Materialien` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stand_id` on the `Materialienausgabe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lager_id` on the `Materialienausgabe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `materialtyp_id` on the `Materialienausgabe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Aufgaben" DROP COLUMN "helfer_id",
ADD COLUMN     "helfer_id" INTEGER NOT NULL,
DROP COLUMN "aufgabentyp_id",
ADD COLUMN     "aufgabentyp_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Materialien" DROP COLUMN "lager_id",
ADD COLUMN     "lager_id" INTEGER NOT NULL,
DROP COLUMN "materialtyp_id",
ADD COLUMN     "materialtyp_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Materialienausgabe" DROP COLUMN "stand_id",
ADD COLUMN     "stand_id" INTEGER NOT NULL,
DROP COLUMN "lager_id",
ADD COLUMN     "lager_id" INTEGER NOT NULL,
DROP COLUMN "materialtyp_id",
ADD COLUMN     "materialtyp_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Aufgaben" ADD CONSTRAINT "Aufgaben_helfer_id_fkey" FOREIGN KEY ("helfer_id") REFERENCES "Helfer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aufgaben" ADD CONSTRAINT "Aufgaben_aufgabentyp_id_fkey" FOREIGN KEY ("aufgabentyp_id") REFERENCES "Aufgabentypen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aufgaben" ADD CONSTRAINT "Aufgaben_funk_id_fkey" FOREIGN KEY ("funk_id") REFERENCES "Funkgeraete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materialien" ADD CONSTRAINT "Materialien_lager_id_fkey" FOREIGN KEY ("lager_id") REFERENCES "Lager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materialien" ADD CONSTRAINT "Materialien_materialtyp_id_fkey" FOREIGN KEY ("materialtyp_id") REFERENCES "Materialtypen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materialienausgabe" ADD CONSTRAINT "Materialienausgabe_stand_id_fkey" FOREIGN KEY ("stand_id") REFERENCES "Staende"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materialienausgabe" ADD CONSTRAINT "Materialienausgabe_lager_id_fkey" FOREIGN KEY ("lager_id") REFERENCES "Lager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materialienausgabe" ADD CONSTRAINT "Materialienausgabe_materialtyp_id_fkey" FOREIGN KEY ("materialtyp_id") REFERENCES "Materialtypen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
