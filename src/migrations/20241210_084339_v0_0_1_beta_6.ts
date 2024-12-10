import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "public"."admin_users_roles" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_admin_users_roles";
  CREATE TYPE "public"."enum_admin_users_roles" AS ENUM('editor', 'admin');
  ALTER TABLE "public"."admin_users_roles" ALTER COLUMN "value" SET DATA TYPE "public"."enum_admin_users_roles" USING "value"::"public"."enum_admin_users_roles";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "public"."admin_users_roles" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_admin_users_roles";
  CREATE TYPE "public"."enum_admin_users_roles" AS ENUM('superadmin', 'admin');
  ALTER TABLE "public"."admin_users_roles" ALTER COLUMN "value" SET DATA TYPE "public"."enum_admin_users_roles" USING "value"::"public"."enum_admin_users_roles";`)
}
