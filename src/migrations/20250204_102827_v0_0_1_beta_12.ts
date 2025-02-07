import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "content_languages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "msds_v2" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"unique_id" varchar,
  	"company_id" integer NOT NULL,
  	"is_published" boolean DEFAULT true,
  	"ai_scanning" boolean DEFAULT true,
  	"msds_created_at" timestamp(3) with time zone,
  	"form_no" varchar,
  	"msds_updated_at" timestamp(3) with time zone,
  	"updated_count" numeric,
  	"author" varchar,
  	"certificate_date" timestamp(3) with time zone,
  	"content_language_id" integer,
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "content_languages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "msds_v2_id" integer;
  DO $$ BEGIN
   ALTER TABLE "msds_v2" ADD CONSTRAINT "msds_v2_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "msds_v2" ADD CONSTRAINT "msds_v2_content_language_id_content_languages_id_fk" FOREIGN KEY ("content_language_id") REFERENCES "public"."content_languages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "content_languages_name_idx" ON "content_languages" USING btree ("name");
  CREATE UNIQUE INDEX IF NOT EXISTS "content_languages_code_idx" ON "content_languages" USING btree ("code");
  CREATE INDEX IF NOT EXISTS "content_languages_updated_at_idx" ON "content_languages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "content_languages_created_at_idx" ON "content_languages" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "msds_v2_name_idx" ON "msds_v2" USING btree ("name");
  CREATE UNIQUE INDEX IF NOT EXISTS "msds_v2_unique_id_idx" ON "msds_v2" USING btree ("unique_id");
  CREATE INDEX IF NOT EXISTS "msds_v2_company_idx" ON "msds_v2" USING btree ("company_id");
  CREATE INDEX IF NOT EXISTS "msds_v2_content_language_idx" ON "msds_v2" USING btree ("content_language_id");
  CREATE INDEX IF NOT EXISTS "msds_v2_updated_at_idx" ON "msds_v2" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "msds_v2_created_at_idx" ON "msds_v2" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "msds_v2_filename_idx" ON "msds_v2" USING btree ("filename");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_content_languages_fk" FOREIGN KEY ("content_languages_id") REFERENCES "public"."content_languages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_msds_v2_fk" FOREIGN KEY ("msds_v2_id") REFERENCES "public"."msds_v2"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_content_languages_id_idx" ON "payload_locked_documents_rels" USING btree ("content_languages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_msds_v2_id_idx" ON "payload_locked_documents_rels" USING btree ("msds_v2_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "content_languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "msds_v2" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "content_languages" CASCADE;
  DROP TABLE "msds_v2" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_content_languages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_msds_v2_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_content_languages_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_msds_v2_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "content_languages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "msds_v2_id";`)
}
