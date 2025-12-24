-- CreateTable
CREATE TABLE "portfolios_mutu" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "categories" TEXT[],
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolios_mutu_pkey" PRIMARY KEY ("id")
);
