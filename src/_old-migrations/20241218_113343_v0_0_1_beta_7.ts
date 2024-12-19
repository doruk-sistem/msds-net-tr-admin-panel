import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "msds_docs" ADD COLUMN "preparation_date" varchar;
  ALTER TABLE "msds_docs" ADD COLUMN "form_no" varchar;
  ALTER TABLE "msds_docs" ADD COLUMN "new_regulation_date" varchar;
  ALTER TABLE "msds_docs" ADD COLUMN "how_many_regulations" varchar;
  ALTER TABLE "msds_contents_msds_content" ADD COLUMN "preparation_date" varchar;
  ALTER TABLE "msds_contents_msds_content" ADD COLUMN "form_no" varchar;
  ALTER TABLE "msds_contents_msds_content" ADD COLUMN "new_regulation_date" varchar;
  ALTER TABLE "msds_contents_msds_content" ADD COLUMN "how_many_regulations" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "msds_docs" DROP COLUMN IF EXISTS "preparation_date";
  ALTER TABLE "msds_docs" DROP COLUMN IF EXISTS "form_no";
  ALTER TABLE "msds_docs" DROP COLUMN IF EXISTS "new_regulation_date";
  ALTER TABLE "msds_docs" DROP COLUMN IF EXISTS "how_many_regulations";
  ALTER TABLE "msds_contents_msds_content" DROP COLUMN IF EXISTS "preparation_date";
  ALTER TABLE "msds_contents_msds_content" DROP COLUMN IF EXISTS "form_no";
  ALTER TABLE "msds_contents_msds_content" DROP COLUMN IF EXISTS "new_regulation_date";
  ALTER TABLE "msds_contents_msds_content" DROP COLUMN IF EXISTS "how_many_regulations";`)
}
