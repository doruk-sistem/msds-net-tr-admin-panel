-- Add emailVerified column to companyUsers table
ALTER TABLE companyUsers ADD COLUMN "emailVerified" boolean DEFAULT false; 