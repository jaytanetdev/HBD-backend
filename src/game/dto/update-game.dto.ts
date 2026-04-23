import { IsObject, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GameType } from '@prisma/client';

export class UpdateGameDto {
  @ApiProperty({ enum: GameType, example: 'BALLOON_POP', required: false })
  @IsEnum(GameType)
  @IsOptional()
  gameType?: GameType;

  @ApiProperty({ example: 2, required: false })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ 
    example: { message: 'Updated message' }, 
    required: false 
  })
  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}
