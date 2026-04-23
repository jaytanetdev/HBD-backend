import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ example: 'Moo Pung' })
  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @ApiProperty({ example: 'theme-id-123' })
  @IsString()
  @IsNotEmpty()
  themeId: string;

  @ApiProperty({ example: 'https://example.com/music.mp3', required: false })
  @IsString()
  @IsOptional()
  backgroundMusicUrl?: string;
}
