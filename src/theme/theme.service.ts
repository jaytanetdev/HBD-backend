import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ThemeService {
  constructor(private prisma: PrismaService) {}

  async getAllThemes() {
    const themes = await this.prisma.theme.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return themes;
  }

  async getThemeById(themeId: string) {
    const theme = await this.prisma.theme.findUnique({
      where: { id: themeId },
    });

    return theme;
  }
}
