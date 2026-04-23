import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GameService } from './game.service';
import { AddGameDto } from './dto/add-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ReorderGamesDto } from './dto/reorder-games.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a game to a card' })
  @ApiResponse({ status: 201, description: 'Game added successfully' })
  async addGame(@GetUser() user: any, @Body() addGameDto: AddGameDto) {
    return this.gameService.addGameToCard(user.id, addGameDto);
  }

  @Get('card/:cardId')
  @ApiOperation({ summary: 'Get all games for a card' })
  @ApiResponse({ status: 200, description: 'Games retrieved successfully' })
  async getGamesByCard(@Param('cardId') cardId: string) {
    return this.gameService.getGamesByCard(cardId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a game' })
  @ApiResponse({ status: 200, description: 'Game updated successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateGame(
    @Param('id') id: string,
    @GetUser() user: any,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gameService.updateGame(id, user.id, updateGameDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a game' })
  @ApiResponse({ status: 200, description: 'Game deleted successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteGame(@Param('id') id: string, @GetUser() user: any) {
    return this.gameService.deleteGame(id, user.id);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder games in a card' })
  @ApiResponse({ status: 200, description: 'Games reordered successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async reorderGames(@GetUser() user: any, @Body() reorderGamesDto: ReorderGamesDto) {
    return this.gameService.reorderGames(user.id, reorderGamesDto);
  }
}
