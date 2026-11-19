/*
  Warnings:

  - You are about to drop the column `teamId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `assigneeId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,team_id]` on the table `TeamMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `team_id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_eventId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- DropIndex
DROP INDEX "TeamMember_userId_teamId_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "teamId",
ADD COLUMN     "team_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assigneeId",
DROP COLUMN "eventId",
ADD COLUMN     "assignee_id" TEXT,
ADD COLUMN     "event_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "teamId",
DROP COLUMN "userId",
ADD COLUMN     "team_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "emailVerified",
DROP COLUMN "image",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_user_id_team_id_key" ON "TeamMember"("user_id", "team_id");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
