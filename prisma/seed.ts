import 'dotenv/config';
import { PrismaClient, GameType } from '@prisma/client';

const prisma = new PrismaClient();

const themes = [
  {
    name: 'Purple Dream',
    primaryColor: '#8B5FBF',
    secondaryColor: '#D4A5F9',
    backgroundColor: '#F3E5FF',
    accentColor: '#6A3D9A',
    gradient: 'linear-gradient(135deg, #8B5FBF 0%, #D4A5F9 100%)',
  },
  {
    name: 'Ocean Blue',
    primaryColor: '#006994',
    secondaryColor: '#4FC3F7',
    backgroundColor: '#E1F5FE',
    accentColor: '#004D6C',
    gradient: 'linear-gradient(135deg, #006994 0%, #4FC3F7 100%)',
  },
  {
    name: 'Sunset Orange',
    primaryColor: '#FF6B35',
    secondaryColor: '#FFB347',
    backgroundColor: '#FFF3E0',
    accentColor: '#E64A19',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
  },
  {
    name: 'Forest Green',
    primaryColor: '#2E7D32',
    secondaryColor: '#81C784',
    backgroundColor: '#E8F5E9',
    accentColor: '#1B5E20',
    gradient: 'linear-gradient(135deg, #2E7D32 0%, #81C784 100%)',
  },
  {
    name: 'Pink Candy',
    primaryColor: '#F06292',
    secondaryColor: '#F8BBD0',
    backgroundColor: '#FCE4EC',
    accentColor: '#C2185B',
    gradient: 'linear-gradient(135deg, #F06292 0%, #F8BBD0 100%)',
  },
  {
    name: 'Galaxy Purple',
    primaryColor: '#4A148C',
    secondaryColor: '#BA68C8',
    backgroundColor: '#F3E5F5',
    accentColor: '#38006B',
    gradient: 'linear-gradient(135deg, #4A148C 0%, #BA68C8 100%)',
  },
  {
    name: 'Golden Hour',
    primaryColor: '#F57F17',
    secondaryColor: '#FFD54F',
    backgroundColor: '#FFFDE7',
    accentColor: '#C65100',
    gradient: 'linear-gradient(135deg, #F57F17 0%, #FFD54F 100%)',
  },
  {
    name: 'Mint Fresh',
    primaryColor: '#00897B',
    secondaryColor: '#80CBC4',
    backgroundColor: '#E0F2F1',
    accentColor: '#00695C',
    gradient: 'linear-gradient(135deg, #00897B 0%, #80CBC4 100%)',
  },
  {
    name: 'Rose Red',
    primaryColor: '#C2185B',
    secondaryColor: '#F48FB1',
    backgroundColor: '#FCE4EC',
    accentColor: '#880E4F',
    gradient: 'linear-gradient(135deg, #C2185B 0%, #F48FB1 100%)',
  },
  {
    name: 'Night Sky',
    primaryColor: '#1A237E',
    secondaryColor: '#5C6BC0',
    backgroundColor: '#E8EAF6',
    accentColor: '#0D1452',
    gradient: 'linear-gradient(135deg, #1A237E 0%, #5C6BC0 100%)',
  },
];

async function main() {
  console.log('Start seeding...');

  for (const theme of themes) {
    const createdTheme = await prisma.theme.create({
      data: theme,
    });
    console.log(`Created theme: ${createdTheme.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
