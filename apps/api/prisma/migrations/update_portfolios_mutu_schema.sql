-- Update portfolios_mutu table structure
-- This migration updates the schema to match the new requirements

-- Drop old columns if they exist
ALTER TABLE "portfolios_mutu" 
DROP COLUMN IF EXISTS "createdBy",
DROP COLUMN IF EXISTS "categories",
DROP COLUMN IF EXISTS "description";

-- Add new columns if they don't exist
DO $$ 
BEGIN
    -- Add subtitle column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='portfolios_mutu' AND column_name='subtitle') THEN
        ALTER TABLE "portfolios_mutu" ADD COLUMN "subtitle" TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add industry column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='portfolios_mutu' AND column_name='industry') THEN
        ALTER TABLE "portfolios_mutu" ADD COLUMN "industry" TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add services column (JSON)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='portfolios_mutu' AND column_name='services') THEN
        ALTER TABLE "portfolios_mutu" ADD COLUMN "services" JSONB NOT NULL DEFAULT '[]'::jsonb;
    END IF;

    -- Add teams column (JSON)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='portfolios_mutu' AND column_name='teams') THEN
        ALTER TABLE "portfolios_mutu" ADD COLUMN "teams" JSONB NOT NULL DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- Remove default values after adding columns
ALTER TABLE "portfolios_mutu" 
ALTER COLUMN "subtitle" DROP DEFAULT,
ALTER COLUMN "industry" DROP DEFAULT;

-- Verify the final structure
-- Expected columns: id, title, subtitle, year, industry, services, teams, images, createdAt, updatedAt
