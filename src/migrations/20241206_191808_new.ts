import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "company_users" ADD COLUMN "hashed_password" varchar;
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

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "company_users" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "company_users" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "company_users" ADD COLUMN "salt" varchar;
  ALTER TABLE "company_users" ADD COLUMN "hash" varchar;
  ALTER TABLE "company_users" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "company_users" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "hashed_password";
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "enable_a_p_i_key";
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "api_key";
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "api_key_index";`)
}
