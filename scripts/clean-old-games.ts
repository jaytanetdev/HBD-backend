import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanOldGames() {
  try {
    console.log('🧹 Cleaning old game types...');
    
    // Delete games with old types
    const result = await prisma.$executeRawUnsafe(`
      DELETE FROM game_instances 
      WHERE "gameType" IN ('PHOTO_REVEAL', 'MEDIA_PLAYER')
    `);
    
    console.log(`✅ Deleted ${result} game instances with old types`);
    
    console.log('✨ Cleanup complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanOldGames();
