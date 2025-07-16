import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // email alanındaki unique constraint'i kaldır
  await db.execute(sql`
    DO $$
    DECLARE
      constraint_name text;
    BEGIN
      SELECT tc.constraint_name INTO constraint_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_name = 'company_users'
        AND tc.constraint_type = 'UNIQUE'
        AND ccu.column_name = 'email';
      IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE "company_users" DROP CONSTRAINT ' || constraint_name || ';';
      END IF;
    END $$;
  `)
  // company_users_email_idx unique index'ini kaldır
  await db.execute(sql`
    DROP INDEX IF EXISTS company_users_email_idx;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // email alanına unique constraint'i tekrar ekle
  await db.execute(sql`
    ALTER TABLE "company_users" ADD CONSTRAINT company_users_email_key UNIQUE (email);
  `)
  // company_users_email_idx unique index'ini tekrar oluştur
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS company_users_email_idx ON company_users (email);
  `)
}
