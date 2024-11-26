import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "companies_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "companies_rels" CASCADE;
  ALTER TABLE "company_users" ADD COLUMN "company_id" integer NOT NULL;
  ALTER TABLE "msds" ADD COLUMN "companies_id" integer;
  ALTER TABLE "msds" ADD COLUMN "published_at" timestamp(3) with time zone;
  DO $$ BEGIN
   ALTER TABLE "company_users" ADD CONSTRAINT "company_users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "msds" ADD CONSTRAINT "msds_companies_id_companies_id_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "company_users_company_idx" ON "company_users" USING btree ("company_id");
  CREATE INDEX IF NOT EXISTS "msds_companies_idx" ON "msds" USING btree ("companies_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TABLE IF NOT EXISTS "companies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"msds_id" integer,
  	"company_users_id" integer
  );
  
  ALTER TABLE "company_users" DROP CONSTRAINT "company_users_company_id_companies_id_fk";
  
  ALTER TABLE "msds" DROP CONSTRAINT "msds_companies_id_companies_id_fk";
  
  DROP INDEX IF EXISTS "company_users_company_idx";
  DROP INDEX IF EXISTS "msds_companies_idx";
  DO $$ BEGIN
   ALTER TABLE "companies_rels" ADD CONSTRAINT "companies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "companies_rels" ADD CONSTRAINT "companies_rels_msds_fk" FOREIGN KEY ("msds_id") REFERENCES "public"."msds"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "companies_rels" ADD CONSTRAINT "companies_rels_company_users_fk" FOREIGN KEY ("company_users_id") REFERENCES "public"."company_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "companies_rels_order_idx" ON "companies_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "companies_rels_parent_idx" ON "companies_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "companies_rels_path_idx" ON "companies_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "companies_rels_msds_id_idx" ON "companies_rels" USING btree ("msds_id");
  CREATE INDEX IF NOT EXISTS "companies_rels_company_users_id_idx" ON "companies_rels" USING btree ("company_users_id");
  ALTER TABLE "company_users" DROP COLUMN IF EXISTS "company_id";
  ALTER TABLE "msds" DROP COLUMN IF EXISTS "companies_id";
  ALTER TABLE "msds" DROP COLUMN IF EXISTS "published_at";`)
}
