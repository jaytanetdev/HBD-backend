import { Injectable } from '@nestjs/common';
import { GameType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CardService } from '../card/card.service';
import { GenerateRandomCardDto } from './dto/generate-random-card.dto';

@Injectable()
export class TemplateService {
  private readonly allGameTypes = [
    GameType.BALLOON_POP,
    GameType.BIRTHDAY_CAKE,
    GameType.GIFT_BOX,
    GameType.SPIN_WHEEL,
    GameType.STICKY_NOTE,
    GameType.REWARD_DISPLAY,
    GameType.MOOD_RATING,
    GameType.MEMORY_COLLAGE,
    GameType.DART_GAME,
    GameType.FISHING_GAME,
    GameType.LUCKY_DRAW,
    GameType.EGG_SHOOTER,
  ];

  constructor(
    private prisma: PrismaService,
    private cardService: CardService,
  ) {}

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  private getDefaultConfigForGame(gameType: GameType): Record<string, any> {
    const configs: Record<GameType, Record<string, any>> = {
      [GameType.BALLOON_POP]: {
        message: 'ปาโป่งให้แตก! 🎈',
        balloonCount: 8,
        revealMessage: 'สุขสันต์วันเกิด!',
      },
      [GameType.BIRTHDAY_CAKE]: {
        message: 'เป่าเทียนวันเกิด 🎂',
        candleCount: 5,
        cakeStyle: 'classic',
      },
      [GameType.GIFT_BOX]: {
        message: 'แกะกล่องของขวัญ! 🎁',
        giftStyle: 'colorful',
      },
      [GameType.SPIN_WHEEL]: {
        title: 'ลุ้นโชคได้เลย!',
        options: ['โชคดีมาก ⭐', 'มีความสุข 🍀', 'ได้ของขวัญ 🎁', 'น่ารัก 😊'],
      },
      [GameType.STICKY_NOTE]: {
        message: 'ขอให้มีความสุขมากๆนะ 💕',
        noteColor: '#FFF9C4',
        author: 'จากเพื่อนรักของคุณ',
      },
      [GameType.REWARD_DISPLAY]: {
        message: 'ได้ของขวัญ!',
        rewards: ['🎁', '🎂', '🎈', '🎉'],
      },
      [GameType.MOOD_RATING]: {
        message: 'วันนี้มีความสุขขนาดไหน?',
        moods: ['😢', '😐', '😊', '😄', '🤩'],
      },
      [GameType.MEMORY_COLLAGE]: {
        message: 'ภาพความทรงจำ',
        imageUrls: [],
      },
      [GameType.DART_GAME]: {
        message: 'ปาลูกดอกให้โดนเป้า!',
        targetMessage: 'เก่งมาก! คุณโดนเป้าแล้ว!',
      },
      [GameType.FISHING_GAME]: {
        message: 'ตกปลาให้ได้ครบทุกตัว!',
        fishCount: 5,
        successMessage: 'เก่งมาก! ตกได้ครบทุกตัว!',
      },
      [GameType.LUCKY_DRAW]: {
        message: 'จับฉลากรับของรางวัล!',
        prizes: ['🎁 ของขวัญพิเศษ', '⭐ รางวัลใหญ่', '💝 ของรางวัล', '🎉 โชคดี', '✨ รางวัลปลอบใจ'],
      },
      [GameType.EGG_SHOOTER]: {
        message: 'ยิงไข่ให้โดน!',
        targetScore: 10,
        successMessage: 'เก่งมาก! ยิงโดนหมดเลย!',
      },
    };

    return configs[gameType];
  }

  async generateRandomCard(userId: string, dto: GenerateRandomCardDto) {
    const themes = await this.prisma.theme.findMany();
    
    if (themes.length === 0) {
      throw new Error('No themes available. Please seed the database first.');
    }

    const randomTheme = themes[this.getRandomInt(0, themes.length - 1)];

    const numberOfGames = this.getRandomInt(3, 7);
    
    const shuffledGames = this.shuffleArray(this.allGameTypes);
    const selectedGames = shuffledGames.slice(0, numberOfGames);

    const card = await this.cardService.createCard(userId, {
      recipientName: dto.recipientName,
      themeId: randomTheme.id,
    });

    const gamePromises = selectedGames.map((gameType, index) =>
      this.prisma.gameInstance.create({
        data: {
          cardId: card.id,
          gameType,
          order: index + 1,
          config: this.getDefaultConfigForGame(gameType),
        },
      }),
    );

    await Promise.all(gamePromises);

    const completeCard = await this.cardService.getCardById(card.id, userId);

    return completeCard;
  }
}
