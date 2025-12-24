-- Add slug column to portfolios_mutu table

-- Step 1: Add slug column with temporary default
ALTER TABLE "portfolios_mutu" 
ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';

-- Step 2: Generate slug from title for existing records
-- This creates URL-friendly slugs from titles
UPDATE "portfolios_mutu"
SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
);

-- Step 3: Handle duplicate slugs by appending ID
UPDATE "portfolios_mutu" p1
SET "slug" = p1."slug" || '-' || SUBSTRING(p1."id", 1, 8)
WHERE EXISTS (
  SELECT 1 FROM "portfolios_mutu" p2
  WHERE p2."slug" = p1."slug" AND p2."id" < p1."id"
);

-- Step 4: Remove default constraint
ALTER TABLE "portfolios_mutu" 
ALTER COLUMN "slug" DROP DEFAULT;

-- Step 5: Add unique constraint
ALTER TABLE "portfolios_mutu"
ADD CONSTRAINT "portfolios_mutu_slug_key" UNIQUE ("slug");

-- Verify
SELECT id, title, slug FROM "portfolios_mutu";
