import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_users" ADD COLUMN "send_email" boolean DEFAULT true;
  ALTER TABLE "company_users" ADD COLUMN "registration_completed" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_users" DROP COLUMN IF EXISTS "send_email";
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "registration_completed";`)
}
