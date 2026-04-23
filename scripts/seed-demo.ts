import axios from 'axios';

const API_BASE = 'http://localhost:9001';

async function main() {
  console.log('🌱 Seeding complete demo data...');

  // 1. Try login first, if not exists then register
  const username = 'demo';
  const password = '123456';
  let token: string;

  try {
    console.log(`🔐 Trying to login as ${username}...`);
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username,
      password,
    });
    token = loginResponse.data.token; // Changed from access_token to token
    console.log(`✅ Logged in as ${username}`);
    if (token) {
      console.log(`🔑 Token: ${token.substring(0, 30)}...`);
    } else {
      console.error('❌ No token in response:', loginResponse.data);
      throw new Error('No token in login response');
    }
  } catch (loginError: any) {
    if (loginError.response?.status === 401) {
      // User not found or wrong password, try register
      try {
        console.log(`📝 User not found, registering...`);
        const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
          username,
          password,
        });
        token = registerResponse.data.token; // Changed from access_token to token
        console.log(`✅ Registered as ${username}`);
        console.log(`🔑 Token: ${token.substring(0, 30)}...`);
      } catch (registerError: any) {
        console.error('❌ Cannot register:', registerError.response?.data || registerError.message);
        throw registerError;
      }
    } else {
      throw loginError;
    }
  }

  const headers = { Authorization: `Bearer ${token}` };

  // 2. Get themes
  const themesResponse = await axios.get(`${API_BASE}/themes`, { headers });
  const themes = themesResponse.data;
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  console.log(`✅ Selected theme: ${randomTheme.name}`);

  // 3. Create card
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

  // 4. Add all 10 games
  const games = [
    // 1. วงล้อหมุน
    {
      gameType: 'SPIN_WHEEL',
      order: 1,
      config: {
        title: 'Moo Pung หมุนวงล้อรับของขวัญ!',
        options: [
          '🎵 เพลงโปรด',
          '🍕 พิซซ่า',
          '🎮 เกม',
          '📚 หนังสือ',
          '🎬 ดูหนัง',
          '☕ กาแฟ',
          '🎨 วาดรูป',
          '🏃 ออกกำลังกาย'
        ],
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
        message: 'ขอให้มีชีวิตที่มีความสุขมากๆนะ 💛\n\nสิ่งสำคัญที่สุดคือให้เพื่อนๆที่ดีอยู่เคียงข้างเสมอนะครับ\n\n— จาก Demo',
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
      gameType: 'DART_GAME',
      order: 10,
      config: {
        message: 'ปาลูกดอกให้โดนเป้า! 🎯',
        targetMessage: 'เก่งมาก! คุณโดนเป้าแล้ว! 🎉',
      },
    },
    // 11. ตกปลา
    {
      gameType: 'FISHING_GAME',
      order: 11,
      config: {
        message: 'ตกปลาให้ได้ครบทุกตัว! 🎣',
        fishCount: 6,
        successMessage: 'เก่งมาก! ตกได้ครบทุกตัว! 🐟',
      },
    },
    // 12. จับฉลาก
    {
      gameType: 'LUCKY_DRAW',
      order: 12,
      config: {
        message: 'จับฉลากรับของรางวัล! 🎁',
        prizes: [
          '🎁 ของขวัญพิเศษ',
          '⭐ รางวัลใหญ่',
          '💝 ของรางวัล VIP',
          '🎉 โชคดีมากๆ',
          '✨ รางวัลปลอบใจ'
        ],
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
    console.log(`✅ Added game ${game.order}/${games.length}: ${game.gameType}`);
  }

  console.log('\n🎉 Seeding completed successfully!');
  console.log(`\n🔗 View card at: http://localhost:3000/c/${card.slug}`);
  console.log(`\n👤 Login with:`);
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${password}`);
  console.log(`\n✨ Card has ${games.length} games total!`);
}

main()
  .catch((error) => {
    console.error('\n❌ Error:', error.response?.data || error.message);
    process.exit(1);
  });
