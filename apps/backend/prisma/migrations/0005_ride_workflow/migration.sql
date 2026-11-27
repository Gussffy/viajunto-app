CREATE TYPE "TripStatus" AS ENUM ('open', 'full', 'in_progress', 'finished', 'cancelled');
CREATE TYPE "RideRequestStatus" AS ENUM ('pending', 'accepted', 'refused', 'cancelled');
CREATE TYPE "NotificationType" AS ENUM (
    'new_request',
    'request_accepted',
    'request_refused',
    'request_cancelled',
    'trip_cancelled',
    'trip_started',
    'trip_finished',
    'new_rating'
);

UPDATE "Trip" SET "status" = 'open' WHERE "status" = 'active';
ALTER TABLE "Trip" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Trip" ALTER COLUMN "status" TYPE "TripStatus" USING "status"::"TripStatus";
ALTER TABLE "Trip" ALTER COLUMN "status" SET DEFAULT 'open';

ALTER TABLE "Trip"
    ADD COLUMN "seatsTotal" INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN "seatsAvailable" INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN "manualApproval" BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN "notes" TEXT;
UPDATE "Trip" SET "seatsTotal" = "assentos", "seatsAvailable" = "assentos";
ALTER TABLE "Trip"
    ALTER COLUMN "seatsTotal" DROP DEFAULT,
    ALTER COLUMN "seatsAvailable" DROP DEFAULT;

CREATE TABLE "RideRequest" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "status" "RideRequestStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RideRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "tripId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RideRequest_tripId_passengerId_key" ON "RideRequest"("tripId", "passengerId");
CREATE INDEX "RideRequest_tripId_status_idx" ON "RideRequest"("tripId", "status");
CREATE INDEX "RideRequest_passengerId_status_idx" ON "RideRequest"("passengerId", "status");
CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification"("userId", "read", "createdAt");
CREATE UNIQUE INDEX "Rating_tripId_authorId_subjectId_key" ON "Rating"("tripId", "authorId", "subjectId");
CREATE INDEX "Rating_subjectId_idx" ON "Rating"("subjectId");

ALTER TABLE "RideRequest" ADD CONSTRAINT "RideRequest_tripId_fkey"
    FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RideRequest" ADD CONSTRAINT "RideRequest_passengerId_fkey"
    FOREIGN KEY ("passengerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tripId_fkey"
    FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_tripId_fkey"
    FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_subjectId_fkey"
    FOREIGN KEY ("subjectId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
