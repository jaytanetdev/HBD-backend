import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating 10 themes...');

  const themes = [
    { id: 'theme1', name: 'Purple Dream', primaryColor: '#8B5FBF', secondaryColor: '#D4A5F9', backgroundColor: '#F3E5FF', accentColor: '#6A3D9A', gradient: 'linear-gradient(135deg, #8B5FBF 0%, #D4A5F9 100%)' },
    { id: 'theme2', name: 'Ocean Blue', primaryColor: '#006994', secondaryColor: '#4FC3F7', backgroundColor: '#E1F5FE', accentColor: '#004D6C', gradient: 'linear-gradient(135deg, #006994 0%, #4FC3F7 100%)' },
    { id: 'theme3', name: 'Sunset Orange', primaryColor: '#FF6B35', secondaryColor: '#FFB347', backgroundColor: '#FFF3E0', accentColor: '#E64A19', gradient: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)' },
    { id: 'theme4', name: 'Forest Green', primaryColor: '#2E7D32', secondaryColor: '#81C784', backgroundColor: '#E8F5E9', accentColor: '#1B5E20', gradient: 'linear-gradient(135deg, #2E7D32 0%, #81C784 100%)' },
    { id: 'theme5', name: 'Pink Candy', primaryColor: '#F06292', secondaryColor: '#F8BBD0', backgroundColor: '#FCE4EC', accentColor: '#C2185B', gradient: 'linear-gradient(135deg, #F06292 0%, #F8BBD0 100%)' },
    { id: 'theme6', name: 'Galaxy Purple', primaryColor: '#4A148C', secondaryColor: '#BA68C8', backgroundColor: '#F3E5F5', accentColor: '#38006B', gradient: 'linear-gradient(135deg, #4A148C 0%, #BA68C8 100%)' },
    { id: 'theme7', name: 'Golden Hour', primaryColor: '#F57F17', secondaryColor: '#FFD54F', backgroundColor: '#FFFDE7', accentColor: '#C65100', gradient: 'linear-gradient(135deg, #F57F17 0%, #FFD54F 100%)' },
    { id: 'theme8', name: 'Mint Fresh', primaryColor: '#00897B', secondaryColor: '#80CBC4', backgroundColor: '#E0F2F1', accentColor: '#00695C', gradient: 'linear-gradient(135deg, #00897B 0%, #80CBC4 100%)' },
    { id: 'theme9', name: 'Rose Red', primaryColor: '#C2185B', secondaryColor: '#F48FB1', backgroundColor: '#FCE4EC', accentColor: '#880E4F', gradient: 'linear-gradient(135deg, #C2185B 0%, #F48FB1 100%)' },
    { id: 'theme10', name: 'Night Sky', primaryColor: '#1A237E', secondaryColor: '#5C6BC0', backgroundColor: '#E8EAF6', accentColor: '#0D1452', gradient: 'linear-gradient(135deg, #1A237E 0%, #5C6BC0 100%)' },
  ];

  for (const theme of themes) {
    await prisma.theme.create({ data: theme });
    console.log(`✓ Created: ${theme.name}`);
  }

  console.log('\n✅ All themes created successfully!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
