CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TYPE "Role" AS ENUM ('guest','owner','admin');
CREATE TYPE "BookingStatus" AS ENUM ('held','confirmed','checked_in','completed','cancelled','refunded');
CREATE TYPE "VerificationStatus" AS ENUM ('pending','approved','rejected');
CREATE TABLE "User" ("id" TEXT PRIMARY KEY,"email" TEXT NOT NULL UNIQUE,"phone" TEXT,"name" TEXT NOT NULL,"role" "Role" NOT NULL DEFAULT 'guest',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "College" ("id" TEXT PRIMARY KEY,"name" TEXT NOT NULL UNIQUE,"area" TEXT NOT NULL,"latitude" DOUBLE PRECISION NOT NULL,"longitude" DOUBLE PRECISION NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "Hostel" ("id" TEXT PRIMARY KEY,"slug" TEXT NOT NULL UNIQUE,"name" TEXT NOT NULL,"area" TEXT NOT NULL,"address" TEXT NOT NULL,"description" TEXT NOT NULL,"genderPolicy" TEXT NOT NULL,"foodIncluded" BOOLEAN NOT NULL DEFAULT false,"foodDetails" TEXT,"verified" BOOLEAN NOT NULL DEFAULT false,"verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'pending',"cancellationPolicy" TEXT NOT NULL DEFAULT 'moderate',"latitude" DOUBLE PRECISION NOT NULL,"longitude" DOUBLE PRECISION NOT NULL,"coverImage" TEXT NOT NULL,"amenities" TEXT[] NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "Room" ("id" TEXT PRIMARY KEY,"hostelId" TEXT NOT NULL REFERENCES "Hostel"("id") ON DELETE CASCADE,"type" TEXT NOT NULL,"label" TEXT NOT NULL,"priceNight" INTEGER NOT NULL,"priceMonth" INTEGER NOT NULL,"minMonths" INTEGER NOT NULL DEFAULT 1,"deposit" INTEGER NOT NULL DEFAULT 0,"totalBeds" INTEGER NOT NULL);
CREATE TABLE "Bed" ("id" TEXT PRIMARY KEY,"roomId" TEXT NOT NULL REFERENCES "Room"("id") ON DELETE CASCADE);
CREATE TABLE "PriceOverride" ("id" TEXT PRIMARY KEY,"roomId" TEXT NOT NULL REFERENCES "Room"("id") ON DELETE CASCADE,"startsAt" TIMESTAMP(3) NOT NULL,"endsAt" TIMESTAMP(3) NOT NULL,"priceNight" INTEGER,"priceMonth" INTEGER);
CREATE TABLE "Booking" ("id" TEXT PRIMARY KEY,"bedId" TEXT NOT NULL REFERENCES "Bed"("id"),"guestId" TEXT NOT NULL REFERENCES "User"("id"),"status" "BookingStatus" NOT NULL DEFAULT 'held',"startDate" TIMESTAMP(3) NOT NULL,"endDate" TIMESTAMP(3) NOT NULL,"amount" INTEGER NOT NULL,"deposit" INTEGER NOT NULL DEFAULT 0,"holdExpiresAt" TIMESTAMP(3),"paymentRef" TEXT,"idempotencyKey" TEXT UNIQUE,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL);
CREATE TABLE "Review" ("id" TEXT PRIMARY KEY,"hostelId" TEXT NOT NULL REFERENCES "Hostel"("id"),"guestId" TEXT NOT NULL REFERENCES "User"("id"),"cleanliness" INTEGER NOT NULL,"safety" INTEGER NOT NULL,"food" INTEGER NOT NULL,"value" INTEGER NOT NULL,"comment" TEXT NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "WebhookEvent" ("id" TEXT PRIMARY KEY,"eventId" TEXT NOT NULL UNIQUE,"eventType" TEXT NOT NULL,"processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX "College_area_idx" ON "College"("area");
CREATE INDEX "Hostel_area_verified_idx" ON "Hostel"("area","verified");
CREATE INDEX "PriceOverride_roomId_startsAt_endsAt_idx" ON "PriceOverride"("roomId","startsAt","endsAt");
CREATE INDEX "Booking_bedId_startDate_endDate_status_idx" ON "Booking"("bedId","startDate","endDate","status");
CREATE INDEX "Booking_status_holdExpiresAt_idx" ON "Booking"("status","holdExpiresAt");
CREATE INDEX "Review_hostelId_createdAt_idx" ON "Review"("hostelId","createdAt");
ALTER TABLE "College" ADD COLUMN "geo" geography(Point,4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint("longitude","latitude"),4326)::geography) STORED;
ALTER TABLE "Hostel" ADD COLUMN "geo" geography(Point,4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint("longitude","latitude"),4326)::geography) STORED;
CREATE INDEX "College_geo_gix" ON "College" USING GIST ("geo");
CREATE INDEX "Hostel_geo_gix" ON "Hostel" USING GIST ("geo");


