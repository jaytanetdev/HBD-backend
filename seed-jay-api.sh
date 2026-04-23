#!/bin/bash

# ข้อมูล mock card สำหรับ Jay
API_URL="http://localhost:9001"

echo "🌱 Creating mock data for user Jay..."

# 1. Register/Login Jay
echo "1️⃣  Register user Jay..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jay",
    "password": "123456"
  }')

# Get token
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.access_token')

if [ "$TOKEN" == "null" ]; then
  echo "   User already exists, trying login..."
  LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "username": "jay",
      "password": "123456"
    }')
  TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')
fi

echo "   ✅ Got token: ${TOKEN:0:20}..."

# 2. Get random theme
echo "2️⃣  Getting theme..."
THEMES=$(curl -s -X GET "$API_URL/theme" -H "Authorization: Bearer $TOKEN")
THEME_ID=$(echo $THEMES | jq -r '.[0].id')
echo "   ✅ Theme ID: $THEME_ID"

# 3. Create card
echo "3️⃣  Creating birthday card..."
CARD_RESPONSE=$(curl -s -X POST "$API_URL/card" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"recipientName\": \"Moo Pung\",
    \"themeId\": \"$THEME_ID\",
    \"coverImageUrl\": \"https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop\"
  }")

CARD_ID=$(echo $CARD_RESPONSE | jq -r '.id')
CARD_SLUG=$(echo $CARD_RESPONSE | jq -r '.slug')
echo "   ✅ Card ID: $CARD_ID"
echo "   ✅ Card Slug: $CARD_SLUG"

# 4. Add games
echo "4️⃣  Adding games to card..."

# Game 1: SpinWheel
curl -s -X POST "$API_URL/game" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cardId\": \"$CARD_ID\",
    \"gameType\": \"SPIN_WHEEL\",
    \"order\": 1,
    \"config\": {
      \"title\": \"Moo Pung คุ้นโตได้โอลุ!\",
      \"options\": [\"🎵 เพลงโปรด\", \"🍕 พิซซ่า\", \"🎮 เกม\", \"📚 หนังสือ\", \"🎬 ดูหนัง\", \"☕ กาแฟ\", \"🎨 วาดรูป\", \"🏃 ออกกำลังกาย\"],
      \"message\": \"หมุนเพื่อดูว่าคุณได้รับของขวัญอะไร! 🎉\"
    }
  }" > /dev/null
echo "   ✅ Added SpinWheel"

# Game 2: BirthdayCake
curl -s -X POST "$API_URL/game" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cardId\": \"$CARD_ID\",
    \"gameType\": \"BIRTHDAY_CAKE\",
    \"order\": 2,
    \"config\": {
      \"message\": \"เป่าเทียนวันเกิด 🎂\",
      \"candleCount\": 5,
      \"wishMessage\": \"ขอให้มีความสุขมากๆ สุขภาพแข็งแรง และประสบความสำเร็จในทุกๆ เรื่องนะคะ! 💖\"
    }
  }" > /dev/null
echo "   ✅ Added BirthdayCake"

# Game 3: GiftBox
curl -s -X POST "$API_URL/game" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cardId\": \"$CARD_ID\",
    \"gameType\": \"GIFT_BOX\",
    \"order\": 3,
    \"config\": {
      \"message\": \"แตะที่อมซ่างของขวัญ!\",
      \"revealMessage\": \"ขอให้ชีวิตเต็มไปด้วยความสุข และรอยยิ้มทุกวัน! มีของขวัญพิเศษรออยู่นะ 🎁✨\"
    }
  }" > /dev/null
echo "   ✅ Added GiftBox"

# Game 4: PhotoReveal
curl -s -X POST "$API_URL/game" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cardId\": \"$CARD_ID\",
    \"gameType\": \"PHOTO_REVEAL\",
    \"order\": 4,
    \"config\": {
      \"imageUrl\": \"https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800&h=600&fit=crop\",
      \"message\": \"ภาพความทรงจำดีๆ ที่เรามีด้วยกัน 📸\\n\\nขอบคุณที่เป็นเพื่อนที่ดีมาโดยตลอดนะ รักเลย! 💕\"
    }
  }" > /dev/null
echo "   ✅ Added PhotoReveal"

# Game 5: BalloonPop
curl -s -X POST "$API_URL/game" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cardId\": \"$CARD_ID\",
    \"gameType\": \"BALLOON_POP\",
    \"order\": 5,
    \"config\": {
      \"message\": \"ขอให้ปีนี้เจอแต่เรื่องดีๆ และมีความสุขทุกวัน! 🎈\",
      \"balloonCount\": 8
    }
  }" > /dev/null
echo "   ✅ Added BalloonPop"

# Game 6: RewardDisplay
curl -s -X POST "$API_URL/game" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cardId\": \"$CARD_ID\",
    \"gameType\": \"REWARD_DISPLAY\",
    \"order\": 6,
    \"config\": {
      \"rewards\": [
        {\"emoji\": \"🎁\", \"text\": \"คูปองกินข้าว 1 มื้อ\"},
        {\"emoji\": \"☕\", \"text\": \"กาแฟฟรี 1 แก้ว\"},
        {\"emoji\": \"🎬\", \"text\": \"ดูหนังด้วยกัน\"},
        {\"emoji\": \"🎮\", \"text\": \"เล่นเกมทั้งวัน\"},
        {\"emoji\": \"🎨\", \"text\": \"วาดรูปให้ฟรี!\"}
      ],
      \"message\": \"ของขวัญพิเศษทั้งหมดให้เธอ! เลือกเอาเลยจ้า 💝\"
    }
  }" > /dev/null
echo "   ✅ Added RewardDisplay"

# Game 7: StickyNote
curl -s -X POST "$API_URL/game" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cardId\": \"$CARD_ID\",
    \"gameType\": \"STICKY_NOTE\",
    \"order\": 7,
    \"config\": {
      \"message\": \"ขอให้มีชีวิตความสุขมากๆนะ 💛\\n\\nสิ่งสำคัญที่สุดคือให้เพื่อนๆที่ดีอยู่เคียงข้างเสมอนะครับ\\n\\n— จาก Nay\"
    }
  }" > /dev/null
echo "   ✅ Added StickyNote"

# Game 8: MoodRating
curl -s -X POST "$API_URL/game" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cardId\": \"$CARD_ID\",
    \"gameType\": \"MOOD_RATING\",
    \"order\": 8,
    \"config\": {
      \"message\": \"วันนี้รู้สึกอย่างไร? เลือกอารมณ์ที่เข้ากับคุณที่สุดเลย! 😊\",
      \"responseMessage\": \"ขอให้ทุกวันของคุณมีแต่ความสุขนะ! หากเหนื่อยก็พักผ่อนบ้างนะคะ 💖\"
    }
  }" > /dev/null
echo "   ✅ Added MoodRating"

# Game 9: MemoryCollage
curl -s -X POST "$API_URL/game" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cardId\": \"$CARD_ID\",
    \"gameType\": \"MEMORY_COLLAGE\",
    \"order\": 9,
    \"config\": {
      \"imageUrls\": [
        \"https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop\",
        \"https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&fit=crop\",
        \"https://images.unsplash.com/photo-1523438097201-512ae7d59c44?w=400&h=400&fit=crop\",
        \"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop\"
      ],
      \"message\": \"ขอให้เรามีความทรงจำดีๆ ไปนานแสนนานเลยนะ! 🖼️💕\\n\\nขอบคุณสำหรับทุกช่วงเวลา ทุกเรื่องราว และทุกรอยยิ้มที่เรามีร่วมกัน จะเก็บไว้ในใจตลอดไป 🥰\"
    }
  }" > /dev/null
echo "   ✅ Added MemoryCollage"

# Game 10: MediaPlayer
curl -s -X POST "$API_URL/game" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cardId\": \"$CARD_ID\",
    \"gameType\": \"MEDIA_PLAYER\",
    \"order\": 10,
    \"config\": {
      \"mediaType\": \"audio\",
      \"mediaUrl\": \"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3\",
      \"message\": \"เพลงพิเศษสำหรับวันเกิดของเธอ 🎵\\n\\nฟังแล้วคิดถึงนะ! สุขสันต์วันเกิดอีกครั้ง! 🎂✨\"
    }
  }" > /dev/null
echo "   ✅ Added MediaPlayer"

echo ""
echo "✨ สร้าง mock data สำเร็จ!"
echo "🔗 View card at: http://localhost:3000/c/$CARD_SLUG"
echo "👤 Login: jay / 123456"
echo ""
