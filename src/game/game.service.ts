import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CardService } from '../card/card.service';
import { AddGameDto } from './dto/add-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ReorderGamesDto } from './dto/reorder-games.dto';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private cardService: CardService,
  ) {}

  async addGameToCard(userId: string, addGameDto: AddGameDto) {
    await this.cardService.getCardById(addGameDto.cardId, userId);

    const game = await this.prisma.gameInstance.create({
      data: {
        cardId: addGameDto.cardId,
        gameType: addGameDto.gameType,
        order: addGameDto.order,
        config: addGameDto.config,
      },
    });

    return game;
  }

  async getGamesByCard(cardId: string) {
    const games = await this.prisma.gameInstance.findMany({
      where: { cardId },
      orderBy: {
        order: 'asc',
      },
    });

    return games;
  }

  async updateGame(gameId: string, userId: string, updateGameDto: UpdateGameDto) {
    const game = await this.prisma.gameInstance.findUnique({
      where: { id: gameId },
      include: { card: true },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.card.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this game');
    }

    const updatedGame = await this.prisma.gameInstance.update({
      where: { id: gameId },
      data: updateGameDto,
    });

    return updatedGame;
  }

  async deleteGame(gameId: string, userId: string) {
    const game = await this.prisma.gameInstance.findUnique({
      where: { id: gameId },
      include: { card: true },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.card.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this game');
    }

    await this.prisma.gameInstance.delete({
      where: { id: gameId },
    });

    return { message: 'Game deleted successfully' };
  }

  async reorderGames(userId: string, reorderGamesDto: ReorderGamesDto) {
    if (reorderGamesDto.games.length === 0) {
      return { message: 'No games to reorder' };
    }

    // ⭐ ดึง games ทั้งหมดมาเช็ค
    const gameIds = reorderGamesDto.games.map(g => g.id);
    const existingGames = await this.prisma.gameInstance.findMany({
      where: { id: { in: gameIds } },
      include: { card: true },
    });

    // ⭐ เช็คว่าเจอครบทุกตัวไหม
    if (existingGames.length !== gameIds.length) {
      const foundIds = existingGames.map(g => g.id);
      const missingIds = gameIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Games not found: ${missingIds.join(', ')}`);
    }

    // ⭐ เช็ค permission ทุกตัว
    const unauthorizedGames = existingGames.filter(g => g.card.userId !== userId);
    if (unauthorizedGames.length > 0) {
      throw new ForbiddenException('You do not have permission to reorder these games');
    }

    // ⭐ Update order ทุกตัว
    const updatePromises = reorderGamesDto.games.map((game) =>
      this.prisma.gameInstance.update({
        where: { id: game.id },
        data: { order: game.order },
      }),
    );

    await Promise.all(updatePromises);

    return { message: 'Games reordered successfully' };
  }
}
