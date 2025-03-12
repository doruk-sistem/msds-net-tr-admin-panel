import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "msds_v2" ALTER COLUMN "id" SET DATA TYPE numeric;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "msds_v2_id" SET DATA TYPE numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "msds_v2" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "msds_v2_id" SET DATA TYPE integer;`)
}
