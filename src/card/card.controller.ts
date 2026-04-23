import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('cards')
@Controller('cards')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new birthday card' })
  @ApiResponse({ status: 201, description: 'Card created successfully' })
  async createCard(@GetUser() user: any, @Body() createCardDto: CreateCardDto) {
    return this.cardService.createCard(user.id, createCardDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all cards of the authenticated user' })
  @ApiResponse({ status: 200, description: 'Cards retrieved successfully' })
  async getMyCards(@GetUser() user: any) {
    return this.cardService.getMyCards(user.id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a card by slug (public)' })
  @ApiResponse({ status: 200, description: 'Card retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async getCardBySlug(@Param('slug') slug: string) {
    return this.cardService.getCardBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a card' })
  @ApiResponse({ status: 200, description: 'Card updated successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateCard(
    @Param('id') id: string,
    @GetUser() user: any,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardService.updateCard(id, user.id, updateCardDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({ status: 200, description: 'Card deleted successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteCard(@Param('id') id: string, @GetUser() user: any) {
    return this.cardService.deleteCard(id, user.id);
  }

  @Post(':id/duplicate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Duplicate a card' })
  @ApiResponse({ status: 201, description: 'Card duplicated successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async duplicateCard(@Param('id') id: string, @GetUser() user: any) {
    return this.cardService.duplicateCard(id, user.id);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get card statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getCardStats(@Param('id') id: string, @GetUser() user: any) {
    return this.cardService.getCardStats(id, user.id);
  }

  @Post(':slug/view')
  @ApiOperation({ summary: 'Increment view count for a card' })
  @ApiResponse({ status: 200, description: 'View count incremented' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async incrementView(@Param('slug') slug: string, @Ip() ip: string) {
    return this.cardService.incrementView(slug, ip);
  }
}
