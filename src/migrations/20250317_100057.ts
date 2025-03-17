import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_msds_requests_status" AS ENUM('pending', 'inProgress', 'completed');
  CREATE TABLE IF NOT EXISTS "msds_requests_responses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" varchar NOT NULL,
  	"responded_by_id" integer NOT NULL,
  	"responded_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "msds_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_name" varchar NOT NULL,
  	"company_id" integer NOT NULL,
  	"status" "enum_msds_requests_status" DEFAULT 'pending' NOT NULL,
  	"sds_file_id" integer,
  	"requested_by_id" integer NOT NULL,
  	"description" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "file_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "msds_requests_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "file_media_id" integer;
  DO $$ BEGIN
   ALTER TABLE "msds_requests_responses" ADD CONSTRAINT "msds_requests_responses_responded_by_id_admin_users_id_fk" FOREIGN KEY ("responded_by_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "msds_requests_responses" ADD CONSTRAINT "msds_requests_responses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."msds_requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "msds_requests" ADD CONSTRAINT "msds_requests_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "msds_requests" ADD CONSTRAINT "msds_requests_sds_file_id_file_media_id_fk" FOREIGN KEY ("sds_file_id") REFERENCES "public"."file_media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "msds_requests" ADD CONSTRAINT "msds_requests_requested_by_id_company_users_id_fk" FOREIGN KEY ("requested_by_id") REFERENCES "public"."company_users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "msds_requests_responses_order_idx" ON "msds_requests_responses" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "msds_requests_responses_parent_id_idx" ON "msds_requests_responses" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "msds_requests_responses_responded_by_idx" ON "msds_requests_responses" USING btree ("responded_by_id");
  CREATE INDEX IF NOT EXISTS "msds_requests_company_idx" ON "msds_requests" USING btree ("company_id");
  CREATE INDEX IF NOT EXISTS "msds_requests_sds_file_idx" ON "msds_requests" USING btree ("sds_file_id");
  CREATE INDEX IF NOT EXISTS "msds_requests_requested_by_idx" ON "msds_requests" USING btree ("requested_by_id");
  CREATE INDEX IF NOT EXISTS "msds_requests_updated_at_idx" ON "msds_requests" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "file_media_updated_at_idx" ON "file_media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "file_media_created_at_idx" ON "file_media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "file_media_filename_idx" ON "file_media" USING btree ("filename");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_msds_requests_fk" FOREIGN KEY ("msds_requests_id") REFERENCES "public"."msds_requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_file_media_fk" FOREIGN KEY ("file_media_id") REFERENCES "public"."file_media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_msds_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("msds_requests_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_file_media_id_idx" ON "payload_locked_documents_rels" USING btree ("file_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "msds_requests_responses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "msds_requests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "file_media" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "msds_requests_responses" CASCADE;
  DROP TABLE "msds_requests" CASCADE;
  DROP TABLE "file_media" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_msds_requests_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_file_media_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_msds_requests_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_file_media_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "msds_requests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "file_media_id";
  DROP TYPE "public"."enum_msds_requests_status";`)
}
