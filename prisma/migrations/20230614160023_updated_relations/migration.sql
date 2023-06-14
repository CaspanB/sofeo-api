-- DropForeignKey
ALTER TABLE "Aufgaben" DROP CONSTRAINT "Aufgaben_aufgabentyp_id_fkey";

-- DropForeignKey
ALTER TABLE "Aufgaben" DROP CONSTRAINT "Aufgaben_helfer_id_fkey";

-- DropForeignKey
ALTER TABLE "Materialien" DROP CONSTRAINT "Materialien_lager_id_fkey";

-- DropForeignKey
ALTER TABLE "Materialien" DROP CONSTRAINT "Materialien_materialtyp_id_fkey";

-- DropForeignKey
ALTER TABLE "Materialienausgabe" DROP CONSTRAINT "Materialienausgabe_lager_id_fkey";

-- DropForeignKey
ALTER TABLE "Materialienausgabe" DROP CONSTRAINT "Materialienausgabe_materialtyp_id_fkey";

-- DropForeignKey
ALTER TABLE "Materialienausgabe" DROP CONSTRAINT "Materialienausgabe_stand_id_fkey";

-- AddForeignKey
ALTER TABLE "Aufgaben" ADD CONSTRAINT "Aufgaben_helfer_id_fkey" FOREIGN KEY ("helfer_id") REFERENCES "Helfer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aufgaben" ADD CONSTRAINT "Aufgaben_aufgabentyp_id_fkey" FOREIGN KEY ("aufgabentyp_id") REFERENCES "Aufgabentypen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materialien" ADD CONSTRAINT "Materialien_lager_id_fkey" FOREIGN KEY ("lager_id") REFERENCES "Lager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materialien" ADD CONSTRAINT "Materialien_materialtyp_id_fkey" FOREIGN KEY ("materialtyp_id") REFERENCES "Materialtypen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materialienausgabe" ADD CONSTRAINT "Materialienausgabe_stand_id_fkey" FOREIGN KEY ("stand_id") REFERENCES "Staende"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materialienausgabe" ADD CONSTRAINT "Materialienausgabe_lager_id_fkey" FOREIGN KEY ("lager_id") REFERENCES "Lager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materialienausgabe" ADD CONSTRAINT "Materialienausgabe_materialtyp_id_fkey" FOREIGN KEY ("materialtyp_id") REFERENCES "Materialtypen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
