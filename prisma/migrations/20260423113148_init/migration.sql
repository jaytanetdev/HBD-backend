-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('BALLOON_POP', 'BIRTHDAY_CAKE', 'GIFT_BOX', 'PHOTO_REVEAL', 'SPIN_WHEEL', 'STICKY_NOTE', 'REWARD_DISPLAY', 'MOOD_RATING', 'MEMORY_COLLAGE', 'MEDIA_PLAYER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "birthday_cards" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "birthday_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_instances" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,
    "order" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "accentColor" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_views" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,

    CONSTRAINT "card_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "birthday_cards_slug_key" ON "birthday_cards"("slug");

-- AddForeignKey
ALTER TABLE "birthday_cards" ADD CONSTRAINT "birthday_cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "birthday_cards" ADD CONSTRAINT "birthday_cards_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_instances" ADD CONSTRAINT "game_instances_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "birthday_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_views" ADD CONSTRAINT "card_views_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "birthday_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
