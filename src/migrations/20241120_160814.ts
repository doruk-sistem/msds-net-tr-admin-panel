import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "company_users" ALTER COLUMN "email" SET NOT NULL;
  ALTER TABLE "company_users" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "company_users" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "company_users" ADD COLUMN "salt" varchar;
  ALTER TABLE "company_users" ADD COLUMN "hash" varchar;
  ALTER TABLE "company_users" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "company_users" ADD COLUMN "lock_until" timestamp(3) with time zone;
  CREATE UNIQUE INDEX IF NOT EXISTS "company_users_email_idx" ON "company_users" USING btree ("email");
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "enable_a_p_i_key";
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "api_key";
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "api_key_index";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP INDEX IF EXISTS "company_users_email_idx";
  ALTER TABLE "company_users" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "company_users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "company_users" ADD COLUMN "api_key" varchar;
  ALTER TABLE "company_users" ADD COLUMN "api_key_index" varchar;
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "reset_password_token";
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "reset_password_expiration";
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "salt";
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "hash";
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "login_attempts";
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "lock_until";`)
}
