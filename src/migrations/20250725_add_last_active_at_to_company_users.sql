-- Adding a field to record the active time of company users

ALTER TABLE company_users ADD COLUMN lastActiveAt TIMESTAMP NULL; 