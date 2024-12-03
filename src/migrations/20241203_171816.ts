import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('tr', 'en');
  CREATE TYPE "public"."enum_admin_users_roles" AS ENUM('superadmin', 'admin');
  CREATE TYPE "public"."enum_companies_status" AS ENUM('active', 'passive');
  CREATE TYPE "public"."enum_companies_country" AS ENUM('AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'TL', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'IM', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'BQ', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'SH', 'KN', 'LC', 'PM', 'VC', 'BL', 'MF', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VA', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW', 'XK', 'CW', 'SX');
  CREATE TYPE "public"."enum_msds_contents_msds_content_msds_language" AS ENUM('aa', 'aa-DJ', 'aa-ER', 'aa-ET', 'af', 'af-NA', 'af-ZA', 'agq', 'agq-CM', 'ak', 'ak-GH', 'sq', 'sq-AL', 'sq-MK', 'gsw', 'gsw-FR', 'gsw-LI', 'gsw-CH', 'am', 'am-ET', 'ar', 'ar-DZ', 'ar-BH', 'ar-TD', 'ar-KM', 'ar-DJ', 'ar-EG', 'ar-ER', 'ar-IQ', 'ar-IL', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MR', 'ar-MA', 'ar-OM', 'ar-PS', 'ar-QA', 'ar-SA', 'ar-SO', 'ar-SS', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-AE', 'ar-001', 'ar-YE', 'hy', 'hy-AM', 'as', 'as-IN', 'ast', 'ast-ES', 'asa', 'asa-TZ', 'az-Cyrl', 'az-Cyrl-AZ', 'az', 'az-Latn', 'az-Latn-AZ', 'ksf', 'ksf-CM', 'bm', 'bm-Latn-ML', 'bn', 'bn-BD', 'bn-IN', 'bas', 'bas-CM', 'ba', 'ba-RU', 'eu', 'eu-ES', 'be', 'be-BY', 'bem', 'bem-ZM', 'bez', 'bez-TZ', 'byn', 'byn-ER', 'brx', 'brx-IN', 'bs-Cyrl', 'bs-Cyrl-BA', 'bs-Latn', 'bs', 'bs-Latn-BA', 'br', 'br-FR', 'bg', 'bg-BG', 'my', 'my-MM', 'ca', 'ca-AD', 'ca-FR', 'ca-IT', 'ca-ES', 'ceb', 'ceb-Latn', 'ceb-Latn-PH', 'tzm-Latn-', 'ku', 'ku-Arab', 'ku-Arab-IQ', 'ccp', 'ccp-Cakm', 'ccp-Cakm-', 'cd-RU', 'chr', 'chr-Cher', 'chr-Cher-US', 'cgg', 'cgg-UG', 'zh-Hans', 'zh', 'zh-CN', 'zh-SG', 'zh-Hant', 'zh-HK', 'zh-MO', 'zh-TW', 'cu-RU', 'swc', 'swc-CD', 'kw', 'kw-GB', 'co', 'co-FR', 'hr', 'hr-HR', 'hr-BA', 'cs', 'cs-CZ', 'da', 'da-DK', 'da-GL', 'prs', 'prs-AF', 'dv', 'dv-MV', 'dua', 'dua-CM', 'nl', 'nl-AW', 'nl-BE', 'nl-BQ', 'nl-CW', 'nl-NL', 'nl-SX', 'nl-SR', 'dz', 'dz-BT', 'ebu', 'ebu-KE', 'en', 'en-AS', 'en-AI', 'en-AG', 'en-AU', 'en-AT', 'en-BS', 'en-BB', 'en-BE', 'en-BZ', 'en-BM', 'en-BW', 'en-IO', 'en-VG', 'en-BI', 'en-CM', 'en-CA', 'en-029', 'en-KY', 'en-CX', 'en-CC', 'en-CK', 'en-CY', 'en-DK', 'en-DM', 'en-ER', 'en-150', 'en-FK', 'en-FI', 'en-FJ', 'en-GM', 'en-DE', 'en-GH', 'en-GI', 'en-GD', 'en-GU', 'en-GG', 'en-GY', 'en-HK', 'en-IN', 'en-IE', 'en-IM', 'en-IL', 'en-JM', 'en-JE', 'en-KE', 'en-KI', 'en-LS', 'en-LR', 'en-MO', 'en-MG', 'en-MW', 'en-MY', 'en-MT', 'en-MH', 'en-MU', 'en-FM', 'en-MS', 'en-NA', 'en-NR', 'en-NL', 'en-NZ', 'en-NG', 'en-NU', 'en-NF', 'en-MP', 'en-PK', 'en-PW', 'en-PG', 'en-PN', 'en-PR', 'en-PH', 'en-RW', 'en-KN', 'en-LC', 'en-VC', 'en-WS', 'en-SC', 'en-SL', 'en-SG', 'en-SX', 'en-SI', 'en-SB', 'en-ZA', 'en-SS', 'en-SH', 'en-SD', 'en-SZ', 'en-SE', 'en-CH', 'en-TZ', 'en-TK', 'en-TO', 'en-TT', 'en-TC', 'en-TV', 'en-UG', 'en-AE', 'en-GB', 'en-US', 'en-UM', 'en-VI', 'en-VU', 'en-001', 'en-ZM', 'en-ZW', 'eo', 'eo-001', 'et', 'et-EE', 'ee', 'ee-GH', 'ee-TG', 'ewo', 'ewo-CM', 'fo', 'fo-DK', 'fo-FO', 'fil', 'fil-PH', 'fi', 'fi-FI', 'fr', 'fr-DZ', 'fr-BE', 'fr-BJ', 'fr-BF', 'fr-BI', 'fr-CM', 'fr-CA', 'fr-CF', 'fr-TD', 'fr-KM', 'fr-CG', 'fr-CD', 'fr-CI', 'fr-DJ', 'fr-GQ', 'fr-FR', 'fr-GF', 'fr-PF', 'fr-GA', 'fr-GP', 'fr-GN', 'fr-HT', 'fr-LU', 'fr-MG', 'fr-ML', 'fr-MQ', 'fr-MR', 'fr-MU', 'fr-YT', 'fr-MA', 'fr-NC', 'fr-NE', 'fr-MC', 'fr-RE', 'fr-RW', 'fr-BL', 'fr-MF', 'fr-PM', 'fr-SN', 'fr-SC', 'fr-CH', 'fr-SY', 'fr-TG', 'fr-TN', 'fr-VU', 'fr-WF', 'fy', 'fy-NL', 'fur', 'fur-IT', 'ff', 'ff-Latn', 'ff-Latn-BF', 'ff-CM', 'ff-Latn-CM', 'ff-Latn-GM', 'ff-Latn-GH', 'ff-GN', 'ff-Latn-GN', 'ff-Latn-GW', 'ff-Latn-LR', 'ff-MR', 'ff-Latn-MR', 'ff-Latn-NE', 'ff-NG', 'ff-Latn-NG', 'ff-Latn-SN', 'ff-Latn-SL', 'gl', 'gl-ES', 'lg', 'lg-UG', 'ka', 'ka-GE', 'de', 'de-AT', 'de-BE', 'de-DE', 'de-IT', 'de-LI', 'de-LU', 'de-CH', 'el', 'el-CY', 'el-GR', 'kl', 'kl-GL', 'gn', 'gn-PY', 'gu', 'gu-IN', 'guz', 'guz-KE', 'ha', 'ha-Latn', 'ha-Latn-GH', 'ha-Latn-NE', 'ha-Latn-NG', 'haw', 'haw-US', 'he', 'he-IL', 'hi', 'hi-IN', 'hu', 'hu-HU', 'is', 'is-IS', 'ig', 'ig-NG', 'id', 'id-ID', 'ia', 'ia-FR', 'ia-001', 'iu', 'iu-Latn', 'iu-Latn-CA', 'iu-Cans', 'iu-Cans-CA', 'ga', 'ga-IE', 'it', 'it-IT', 'it-SM', 'it-CH', 'it-VA', 'ja', 'ja-JP', 'jv', 'jv-Latn', 'jv-Latn-ID', 'dyo', 'dyo-SN', 'kea', 'kea-CV', 'kab', 'kab-DZ', 'kkj', 'kkj-CM', 'kln', 'kln-KE', 'kam', 'kam-KE', 'kn', 'kn-IN', 'ks', 'ks-Arab', 'ks-Arab-IN', 'kk', 'kk-KZ', 'km', 'km-KH', 'quc', 'quc-Latn-GT', 'ki', 'ki-KE', 'rw', 'rw-RW', 'sw', 'sw-KE', 'sw-TZ', 'sw-UG', 'kok', 'kok-IN', 'ko', 'ko-KR', 'ko-KP', 'khq', 'khq-ML', 'ses', 'ses-ML', 'nmg', 'nmg-CM', 'ky', 'ky-KG', 'ku-Arab-IR', 'lkt', 'lkt-US', 'lag', 'lag-TZ', 'lo', 'lo-LA', 'lv', 'lv-LV', 'ln', 'ln-AO', 'ln-CF', 'ln-CG', 'ln-CD', 'lt', 'lt-LT', 'nds', 'nds-DE', 'nds-NL', 'dsb', 'dsb-DE', 'lu', 'lu-CD', 'luo', 'luo-KE', 'lb', 'lb-LU', 'luy', 'luy-KE', 'mk', 'mk-MK', 'jmc', 'jmc-TZ', 'mgh', 'mgh-MZ', 'kde', 'kde-TZ', 'mg', 'mg-MG', 'ms', 'ms-BN', 'ms-MY', 'ml', 'ml-IN', 'mt', 'mt-MT', 'gv', 'gv-IM', 'mi', 'mi-NZ', 'arn', 'arn-CL', 'mr', 'mr-IN', 'mas', 'mas-KE', 'mas-TZ', 'mzn-IR', 'mer', 'mer-KE', 'mgo', 'mgo-CM', 'moh', 'moh-CA', 'mn', 'mn-Cyrl', 'mn-MN', 'mn-Mong', 'mn-Mong-CN', 'mn-Mong-MN', 'mfe', 'mfe-MU', 'mua', 'mua-CM', 'nqo', 'nqo-GN', 'naq', 'naq-NA', 'ne', 'ne-IN', 'ne-NP', 'nnh', 'nnh-CM', 'jgo', 'jgo-CM', 'lrc-IQ', 'lrc-IR', 'nd', 'nd-ZW', 'no', 'nb', 'nb-NO', 'nn', 'nn-NO', 'nb-SJ', 'nus', 'nus-SD', 'nus-SS', 'nyn', 'nyn-UG', 'oc', 'oc-FR', 'or', 'or-IN', 'om', 'om-ET', 'om-KE', 'os', 'os-GE', 'os-RU', 'ps', 'ps-AF', 'ps-PK', 'fa', 'fa-AF', 'fa-IR', 'pl', 'pl-PL', 'pt', 'pt-AO', 'pt-BR', 'pt-CV', 'pt-GQ', 'pt-GW', 'pt-LU', 'pt-MO', 'pt-MZ', 'pt-PT', 'pt-ST', 'pt-CH', 'pt-TL', 'prg-001', 'qps-ploca', 'qps-ploc', 'qps-plocm', 'pa', 'pa-Arab', 'pa-IN', 'pa-Arab-PK', 'quz', 'quz-BO', 'quz-EC', 'quz-PE', 'ksh', 'ksh-DE', 'ro', 'ro-MD', 'ro-RO', 'rm', 'rm-CH', 'rof', 'rof-TZ', 'rn', 'rn-BI', 'ru', 'ru-BY', 'ru-KZ', 'ru-KG', 'ru-MD', 'ru-RU', 'ru-UA', 'rwk', 'rwk-TZ', 'ssy', 'ssy-ER', 'sah', 'sah-RU', 'saq', 'saq-KE', 'smn', 'smn-FI', 'smj', 'smj-NO', 'smj-SE', 'se', 'se-FI', 'se-NO', 'se-SE', 'sms', 'sms-FI', 'sma', 'sma-NO', 'sma-SE', 'sg', 'sg-CF', 'sbp', 'sbp-TZ', 'sa', 'sa-IN', 'gd', 'gd-GB', 'seh', 'seh-MZ', 'sr-Cyrl', 'sr-Cyrl-BA', 'sr-Cyrl-ME', 'sr-Cyrl-RS', 'sr-Cyrl-CS', 'sr-Latn', 'sr', 'sr-Latn-BA', 'sr-Latn-ME', 'sr-Latn-RS', 'sr-Latn-CS', 'nso', 'nso-ZA', 'tn', 'tn-BW', 'tn-ZA', 'ksb', 'ksb-TZ', 'sn', 'sn-Latn', 'sn-Latn-ZW', 'sd', 'sd-Arab', 'sd-Arab-PK', 'si', 'si-LK', 'sk', 'sk-SK', 'sl', 'sl-SI', 'xog', 'xog-UG', 'so', 'so-DJ', 'so-ET', 'so-KE', 'so-SO', 'st', 'st-ZA', 'nr', 'nr-ZA', 'st-LS', 'es', 'es-AR', 'es-BZ', 'es-VE', 'es-BO', 'es-BR', 'es-CL', 'es-CO', 'es-CR', 'es-CU', 'es-DO', 'es-EC', 'es-SV', 'es-GQ', 'es-GT', 'es-HN', 'es-419', 'es-MX', 'es-NI', 'es-PA', 'es-PY', 'es-PE', 'es-PH', 'es-PR', 'es-ES_tradnl', 'es-ES', 'es-US', 'es-UY', 'zgh', 'zgh-Tfng-MA', 'zgh-Tfng', 'ss', 'ss-ZA', 'ss-SZ', 'sv', 'sv-AX', 'sv-FI', 'sv-SE', 'syr', 'syr-SY', 'shi', 'shi-Tfng', 'shi-Tfng-MA', 'shi-Latn', 'shi-Latn-MA', 'dav', 'dav-KE', 'tg', 'tg-Cyrl', 'tg-Cyrl-TJ', 'tzm', 'tzm-Latn', 'tzm-Latn-DZ', 'ta', 'ta-IN', 'ta-MY', 'ta-SG', 'ta-LK', 'twq', 'twq-NE', 'tt', 'tt-RU', 'te', 'te-IN', 'teo', 'teo-KE', 'teo-UG', 'th', 'th-TH', 'bo', 'bo-IN', 'bo-CN', 'tig', 'tig-ER', 'ti', 'ti-ER', 'ti-ET', 'to', 'to-TO', 'ts', 'ts-ZA', 'tr', 'tr-CY', 'tr-TR', 'tk', 'tk-TM', 'uk', 'uk-UA', 'hsb', 'hsb-DE', 'ur', 'ur-IN', 'ur-PK', 'ug', 'ug-CN', 'uz-Arab', 'uz-Arab-AF', 'uz-Cyrl', 'uz-Cyrl-UZ', 'uz', 'uz-Latn', 'uz-Latn-UZ', 'vai', 'vai-Vaii', 'vai-Vaii-LR', 'vai-Latn-LR', 'vai-Latn', 'ca-ES-', 've', 've-ZA', 'vi', 'vi-VN', 'vo', 'vo-001', 'vun', 'vun-TZ', 'wae', 'wae-CH', 'cy', 'cy-GB', 'wal', 'wal-ET', 'wo', 'wo-SN', 'xh', 'xh-ZA', 'yav', 'yav-CM', 'ii', 'ii-CN', 'yo', 'yo-BJ', 'yo-NG', 'dje', 'dje-NE', 'zu', 'zu-ZA');
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" jsonb,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "admin_users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_admin_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "admin_users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "company_users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"fullname" varchar NOT NULL,
  	"personal_phone_number" varchar NOT NULL,
  	"position" varchar,
  	"company_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "companies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"status" "enum_companies_status" DEFAULT 'active',
  	"email" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"phone_number" varchar NOT NULL,
  	"tax_number" varchar,
  	"tax_office" varchar,
  	"trade_registry_number" varchar,
  	"mersis_number" varchar,
  	"country" "enum_companies_country",
  	"state" varchar,
  	"city" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "msds_docs" (
  	"id" serial PRIMARY KEY NOT NULL,
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
  
  CREATE TABLE IF NOT EXISTS "msds_contents_msds_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"msds_file_id" integer NOT NULL,
  	"msds_language" "enum_msds_contents_msds_content_msds_language" NOT NULL,
  	"msds_uniuqe_id" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "msds_contents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"company_id" integer NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"is_published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"admin_users_id" integer,
  	"company_users_id" integer,
  	"companies_id" integer,
  	"msds_docs_id" integer,
  	"msds_contents_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admin_users_id" integer,
  	"company_users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "admin_users_roles" ADD CONSTRAINT "admin_users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "company_users" ADD CONSTRAINT "company_users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "msds_contents_msds_content" ADD CONSTRAINT "msds_contents_msds_content_msds_file_id_msds_docs_id_fk" FOREIGN KEY ("msds_file_id") REFERENCES "public"."msds_docs"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "msds_contents_msds_content" ADD CONSTRAINT "msds_contents_msds_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."msds_contents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "msds_contents" ADD CONSTRAINT "msds_contents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admin_users_fk" FOREIGN KEY ("admin_users_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_company_users_fk" FOREIGN KEY ("company_users_id") REFERENCES "public"."company_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_msds_docs_fk" FOREIGN KEY ("msds_docs_id") REFERENCES "public"."msds_docs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_msds_contents_fk" FOREIGN KEY ("msds_contents_id") REFERENCES "public"."msds_contents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admin_users_fk" FOREIGN KEY ("admin_users_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_company_users_fk" FOREIGN KEY ("company_users_id") REFERENCES "public"."company_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX IF NOT EXISTS "admin_users_roles_order_idx" ON "admin_users_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "admin_users_roles_parent_idx" ON "admin_users_roles" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "admin_users_updated_at_idx" ON "admin_users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "admin_users_created_at_idx" ON "admin_users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_email_idx" ON "admin_users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "company_users_company_idx" ON "company_users" USING btree ("company_id");
  CREATE INDEX IF NOT EXISTS "company_users_updated_at_idx" ON "company_users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "company_users_created_at_idx" ON "company_users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "company_users_email_idx" ON "company_users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "companies_updated_at_idx" ON "companies" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "companies_created_at_idx" ON "companies" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "msds_docs_updated_at_idx" ON "msds_docs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "msds_docs_created_at_idx" ON "msds_docs" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "msds_docs_filename_idx" ON "msds_docs" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "msds_contents_msds_content_order_idx" ON "msds_contents_msds_content" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "msds_contents_msds_content_parent_id_idx" ON "msds_contents_msds_content" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "msds_contents_msds_content_msds_file_idx" ON "msds_contents_msds_content" USING btree ("msds_file_id");
  CREATE INDEX IF NOT EXISTS "msds_contents_company_idx" ON "msds_contents" USING btree ("company_id");
  CREATE INDEX IF NOT EXISTS "msds_contents_updated_at_idx" ON "msds_contents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "msds_contents_created_at_idx" ON "msds_contents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_admin_users_id_idx" ON "payload_locked_documents_rels" USING btree ("admin_users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_company_users_id_idx" ON "payload_locked_documents_rels" USING btree ("company_users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_companies_id_idx" ON "payload_locked_documents_rels" USING btree ("companies_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_msds_docs_id_idx" ON "payload_locked_documents_rels" USING btree ("msds_docs_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_msds_contents_id_idx" ON "payload_locked_documents_rels" USING btree ("msds_contents_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_admin_users_id_idx" ON "payload_preferences_rels" USING btree ("admin_users_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_company_users_id_idx" ON "payload_preferences_rels" USING btree ("company_users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "media" CASCADE;
  DROP TABLE "admin_users_roles" CASCADE;
  DROP TABLE "admin_users" CASCADE;
  DROP TABLE "company_users" CASCADE;
  DROP TABLE "companies" CASCADE;
  DROP TABLE "msds_docs" CASCADE;
  DROP TABLE "msds_contents_msds_content" CASCADE;
  DROP TABLE "msds_contents" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_admin_users_roles";
  DROP TYPE "public"."enum_companies_status";
  DROP TYPE "public"."enum_companies_country";
  DROP TYPE "public"."enum_msds_contents_msds_content_msds_language";`)
}
