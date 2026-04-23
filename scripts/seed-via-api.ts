import axios from 'axios';

const API_BASE = 'http://localhost:9001';

async function main() {
  console.log('🌱 Seeding data via API...');

  const username = `jay${Date.now()}`.substring(0, 15); // สร้าง username ที่ไม่ซ้ำ
  const password = '123456';

  // 1. Register user ใหม่
  let token: string;
  try {
    console.log(`📝 Registering new user: ${username}...`);
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      username,
      password,
    });
    token = registerResponse.data.access_token;
    console.log(`✅ Registered and logged in as ${username}`);
  } catch (error: any) {
    console.error('❌ Failed to register:', error.response?.data || error.message);
    throw error;
  }

  const headers = { Authorization: `Bearer ${token}` };

  // 2. ดึง themes
  const themesResponse = await axios.get(`${API_BASE}/themes`, { headers });
  const themes = themesResponse.data;
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  console.log(`✅ Selected theme: ${randomTheme.name}`);

  // 3. สร้างการ์ด
  const cardResponse = await axios.post(
    `${API_BASE}/cards`,
    {
      recipientName: 'Moo Pung',
      themeId: randomTheme.id,
    },
    { headers }
  );
  const card = cardResponse.data;
  console.log(`✅ Created card: ${card.slug}`);

  // 4. เพิ่มเกมทั้งหมด
  const games = [
    // 1. วงล้อหมุน
    {
      gameType: 'SPIN_WHEEL',
      order: 1,
      config: {
        title: 'Moo Pung หมุนวงล้อรับของขวัญ!',
        options: ['🎵 เพลงโปรด', '🍕 พิซซ่า', '🎮 เกม', '📚 หนังสือ', '🎬 ดูหนัง', '☕ กาแฟ', '🎨 วาดรูป', '🏃 ออกกำลังกาย'],
        message: 'หมุนเพื่อดูว่าคุณได้รับของขวัญอะไร! 🎉',
      },
    },
    // 2. เค้กวันเกิด
    {
      gameType: 'BIRTHDAY_CAKE',
      order: 2,
      config: {
        message: 'เป่าเทียนวันเกิด 🎂',
        candleCount: 5,
        wishMessage: 'ขอให้มีความสุขมากๆ สุขภาพแข็งแรง และประสบความสำเร็จในทุกๆ เรื่องนะคะ! 💖',
      },
    },
    // 3. กล่องของขวัญ
    {
      gameType: 'GIFT_BOX',
      order: 3,
      config: {
        message: 'แตะที่กล่องของขวัญ!',
        revealMessage: 'ขอให้ชีวิตเต็มไปด้วยความสุข และรอยยิ้มทุกวัน! มีของขวัญพิเศษรออยู่นะ 🎁✨',
        imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600',
      },
    },
    // 4. เปิดเผยรูปภาพ
    {
      gameType: 'PHOTO_REVEAL',
      order: 4,
      config: {
        imageUrl: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800',
        message: 'ภาพความทรงจำดีๆ ที่เรามีด้วยกัน 📸\n\nขอบคุณที่เป็นเพื่อนที่ดีมาโดยตลอดนะ รักเลย! 💕',
      },
    },
    // 5. ลูกโป่ง
    {
      gameType: 'BALLOON_POP',
      order: 5,
      config: {
        message: 'แตะลูกโป่งเพื่อเปิดความสุข! 🎈',
        balloonCount: 8,
        revealMessage: 'ขอให้ปีนี้เจอแต่เรื่องดีๆ และมีความสุขทุกวัน! 🎉🎊',
      },
    },
    // 6. ของรางวัล
    {
      gameType: 'REWARD_DISPLAY',
      order: 6,
      config: {
        rewards: [
          { emoji: '🎁', text: 'คูปองกินข้าว 1 มื้อ' },
          { emoji: '☕', text: 'กาแฟฟรี 1 แก้ว' },
          { emoji: '🎬', text: 'ดูหนังด้วยกัน' },
          { emoji: '🎮', text: 'เล่นเกมทั้งวัน' },
          { emoji: '🎨', text: 'วาดรูปให้ฟรี!' },
        ],
        message: 'ของขวัญพิเศษทั้งหมดให้เธอ! เลือกเอาเลยจ้า 💝',
      },
    },
    // 7. โน้ต
    {
      gameType: 'STICKY_NOTE',
      order: 7,
      config: {
        message: 'ขอให้มีชีวิตที่มีความสุขมากๆนะ 💛\n\nสิ่งสำคัญที่สุดคือให้เพื่อนๆที่ดีอยู่เคียงข้างเสมอนะครับ\n\n— จาก Jay',
      },
    },
    // 8. โพลล์อารมณ์
    {
      gameType: 'MOOD_RATING',
      order: 8,
      config: {
        message: 'วันนี้รู้สึกอย่างไร? เลือกอารมณ์ที่เข้ากับคุณที่สุดเลย! 😊',
        responseMessage: 'ขอให้ทุกวันของคุณมีแต่ความสุขนะ! หากเหนื่อยก็พักผ่อนบ้างนะคะ 💖',
      },
    },
    // 9. ภาพความทรงจำ
    {
      gameType: 'MEMORY_COLLAGE',
      order: 9,
      config: {
        imageUrls: [
          'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
          'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400',
          'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?w=400',
          'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
        ],
        message: 'ขอให้เรามีความทรงจำดีๆ ไปนานแสนนานเลยนะ! 🖼️💕\n\nขอบคุณสำหรับทุกช่วงเวลา ทุกเรื่องราว และทุกรอยยิ้มที่เรามีร่วมกัน จะเก็บไว้ในใจตลอดไป 🥰',
      },
    },
    // 10. เพลง/วิดีโอ
    {
      gameType: 'MEDIA_PLAYER',
      order: 10,
      config: {
        mediaType: 'audio',
        mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        message: 'เพลงพิเศษสำหรับวันเกิดของเธอ 🎵\n\nฟังแล้วคิดถึงนะ! สุขสันต์วันเกิดอีกครั้ง! 🎂✨',
      },
    },
  ];

  for (const game of games) {
    await axios.post(
      `${API_BASE}/games`,
      {
        cardId: card.id,
        ...game,
      },
      { headers }
    );
    console.log(`✅ Added game: ${game.gameType}`);
  }

  console.log('\n🎉 Seeding completed!');
  console.log(`\n🔗 View card at: http://localhost:3000/c/${card.slug}`);
  console.log(`\n👤 Login credentials:`);
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${password}`);
}

main()
  .catch((error) => {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  });
