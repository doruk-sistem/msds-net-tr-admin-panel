import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_msds_requests_v2_status" AS ENUM('pending', 'inProgress', 'completed');
  CREATE TABLE IF NOT EXISTS "msds_requests_v2" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_name" varchar NOT NULL,
  	"company_id" integer NOT NULL,
  	"status" "enum_msds_requests_v2_status" DEFAULT 'pending' NOT NULL,
  	"requested_by_id" integer NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "msds_requests_v2_id" integer;
  DO $$ BEGIN
   ALTER TABLE "msds_requests_v2" ADD CONSTRAINT "msds_requests_v2_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "msds_requests_v2" ADD CONSTRAINT "msds_requests_v2_requested_by_id_company_users_id_fk" FOREIGN KEY ("requested_by_id") REFERENCES "public"."company_users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "msds_requests_v2_company_idx" ON "msds_requests_v2" USING btree ("company_id");
  CREATE INDEX IF NOT EXISTS "msds_requests_v2_requested_by_idx" ON "msds_requests_v2" USING btree ("requested_by_id");
  CREATE INDEX IF NOT EXISTS "msds_requests_v2_updated_at_idx" ON "msds_requests_v2" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "msds_requests_v2_created_at_idx" ON "msds_requests_v2" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "msds_requests_v2_filename_idx" ON "msds_requests_v2" USING btree ("filename");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_msds_requests_v2_fk" FOREIGN KEY ("msds_requests_v2_id") REFERENCES "public"."msds_requests_v2"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_msds_requests_v2_id_idx" ON "payload_locked_documents_rels" USING btree ("msds_requests_v2_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "msds_requests_v2" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "msds_requests_v2" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_msds_requests_v2_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_msds_requests_v2_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "msds_requests_v2_id";
  DROP TYPE "public"."enum_msds_requests_v2_status";`)
}
