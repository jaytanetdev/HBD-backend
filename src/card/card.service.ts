import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);

@Injectable()
export class CardService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(recipientName: string): string {
    const nameSlug = recipientName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, '');
    const randomPart = nanoid();
    return `${nameSlug}-${randomPart}`;
  }

  async createCard(userId: string, createCardDto: CreateCardDto) {
    const slug = this.generateSlug(createCardDto.recipientName);

    const card = await this.prisma.birthdayCard.create({
      data: {
        slug,
        recipientName: createCardDto.recipientName,
        userId,
        themeId: createCardDto.themeId,
      },
      include: {
        theme: true,
        games: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return card;
  }

  async getMyCards(userId: string) {
    const cards = await this.prisma.birthdayCard.findMany({
      where: { userId },
      include: {
        theme: true,
        games: {
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: { views: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return cards.map((card) => ({
      ...card,
      viewCount: card._count.views,
    }));
  }

  async getCardBySlug(slug: string) {
    const card = await this.prisma.birthdayCard.findUnique({
      where: { slug },
      include: {
        theme: true,
        games: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  async getCardById(cardId: string, userId: string) {
    const card = await this.prisma.birthdayCard.findUnique({
      where: { id: cardId },
      include: {
        theme: true,
        games: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this card');
    }

    return card;
  }

  async updateCard(cardId: string, userId: string, updateCardDto: UpdateCardDto) {
    const card = await this.getCardById(cardId, userId);

    const updatedCard = await this.prisma.birthdayCard.update({
      where: { id: cardId },
      data: updateCardDto,
      include: {
        theme: true,
        games: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return updatedCard;
  }

  async deleteCard(cardId: string, userId: string) {
    await this.getCardById(cardId, userId);

    await this.prisma.birthdayCard.delete({
      where: { id: cardId },
    });

    return { message: 'Card deleted successfully' };
  }

  async duplicateCard(cardId: string, userId: string) {
    const originalCard = await this.getCardById(cardId, userId);

    const newSlug = this.generateSlug(originalCard.recipientName);

    const newCard = await this.prisma.birthdayCard.create({
      data: {
        slug: newSlug,
        recipientName: originalCard.recipientName,
        userId,
        themeId: originalCard.themeId,
        games: {
          create: originalCard.games.map((game) => ({
            gameType: game.gameType,
            order: game.order,
            config: game.config as any,
          })),
        },
      },
      include: {
        theme: true,
        games: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return newCard;
  }

  async incrementView(slug: string, ipAddress?: string) {
    const card = await this.prisma.birthdayCard.findUnique({
      where: { slug },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    await this.prisma.cardView.create({
      data: {
        cardId: card.id,
        ipAddress,
      },
    });

    await this.prisma.birthdayCard.update({
      where: { id: card.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return { success: true };
  }

  async getCardStats(cardId: string, userId: string) {
    const card = await this.getCardById(cardId, userId);

    const views = await this.prisma.cardView.findMany({
      where: { cardId },
      orderBy: {
        viewedAt: 'desc',
      },
      take: 50,
    });

    const viewsByDate = await this.prisma.cardView.groupBy({
      by: ['viewedAt'],
      where: { cardId },
      _count: true,
    });

    return {
      card: {
        id: card.id,
        slug: card.slug,
        recipientName: card.recipientName,
        createdAt: card.createdAt,
      },
      totalViews: card.viewCount,
      recentViews: views,
      viewsByDate,
    };
  }
}
