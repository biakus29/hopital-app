-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Broadcast" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'WHATSAPP',
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "filterTag" TEXT,
    "filterStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" DATETIME,
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "eventId" INTEGER,
    CONSTRAINT "Broadcast_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Broadcast" ("createdAt", "eventId", "failedCount", "filterStatus", "filterTag", "finishedAt", "id", "mediaUrl", "message", "scheduledAt", "sentCount", "startedAt", "status", "title", "totalCount", "updatedAt") SELECT "createdAt", "eventId", "failedCount", "filterStatus", "filterTag", "finishedAt", "id", "mediaUrl", "message", "scheduledAt", "sentCount", "startedAt", "status", "title", "totalCount", "updatedAt" FROM "Broadcast";
DROP TABLE "Broadcast";
ALTER TABLE "new_Broadcast" RENAME TO "Broadcast";
CREATE TABLE "new_BroadcastDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "broadcastId" INTEGER NOT NULL,
    "subscriberId" INTEGER NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'WHATSAPP',
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "error" TEXT,
    "sentAt" DATETIME,
    CONSTRAINT "BroadcastDelivery_broadcastId_fkey" FOREIGN KEY ("broadcastId") REFERENCES "Broadcast" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BroadcastDelivery_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BroadcastDelivery" ("broadcastId", "error", "id", "sentAt", "status", "subscriberId") SELECT "broadcastId", "error", "id", "sentAt", "status", "subscriberId" FROM "BroadcastDelivery";
DROP TABLE "BroadcastDelivery";
ALTER TABLE "new_BroadcastDelivery" RENAME TO "BroadcastDelivery";
CREATE UNIQUE INDEX "BroadcastDelivery_broadcastId_subscriberId_channel_key" ON "BroadcastDelivery"("broadcastId", "subscriberId", "channel");
CREATE TABLE "new_Subscriber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT,
    "email" TEXT,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "language" TEXT NOT NULL DEFAULT 'en',
    "optInWhatsapp" BOOLEAN NOT NULL DEFAULT true,
    "optInSms" BOOLEAN NOT NULL DEFAULT false,
    "optInEmail" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" DATETIME,
    "lastMessageAt" DATETIME,
    "source" TEXT,
    "notes" TEXT
);
INSERT INTO "new_Subscriber" ("id", "joinedAt", "language", "lastMessageAt", "name", "notes", "phone", "source", "status", "unsubscribedAt") SELECT "id", "joinedAt", "language", "lastMessageAt", "name", "notes", "phone", "source", "status", "unsubscribedAt" FROM "Subscriber";
DROP TABLE "Subscriber";
ALTER TABLE "new_Subscriber" RENAME TO "Subscriber";
CREATE UNIQUE INDEX "Subscriber_phone_key" ON "Subscriber"("phone");
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
