import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThemeService } from './theme.service';

@ApiTags('themes')
@Controller('themes')
export class ThemeController {
  constructor(private themeService: ThemeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available themes' })
  @ApiResponse({ status: 200, description: 'Themes retrieved successfully' })
  async getAllThemes() {
    return this.themeService.getAllThemes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a theme by ID' })
  @ApiResponse({ status: 200, description: 'Theme retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Theme not found' })
  async getThemeById(@Param('id') id: string) {
    return this.themeService.getThemeById(id);
  }
}
