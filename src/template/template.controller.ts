import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TemplateService } from './template.service';
import { GenerateRandomCardDto } from './dto/generate-random-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('template')
@Controller('template')
export class TemplateController {
  constructor(private templateService: TemplateService) {}

  @Post('random')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a random birthday card with games' })
  @ApiResponse({ status: 201, description: 'Random card generated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async generateRandomCard(
    @GetUser() user: any,
    @Body() generateRandomCardDto: GenerateRandomCardDto,
  ) {
    return this.templateService.generateRandomCard(user.id, generateRandomCardDto);
  }
}
