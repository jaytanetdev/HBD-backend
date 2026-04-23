import { IsString, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCardDto {
  @ApiProperty({ example: 'Updated Name', required: false })
  @IsString()
  @IsOptional()
  recipientName?: string;

  @ApiProperty({ example: 'theme-id-456', required: false })
  @IsString()
  @IsOptional()
  themeId?: string;

  @ApiProperty({ 
    example: 'https://example.com/music.mp3', 
    required: false,
    nullable: true,
    description: 'Background music URL. Set to null to remove music.'
  })
  @ValidateIf((o) => o.backgroundMusicUrl !== null)
  @IsString()
  @IsOptional()
  backgroundMusicUrl?: string | null;
}
