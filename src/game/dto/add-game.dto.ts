import { IsEnum, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GameType } from '@prisma/client';

export class AddGameDto {
  @ApiProperty({ example: 'card-id-123' })
  @IsNotEmpty()
  cardId: string;

  @ApiProperty({ enum: GameType, example: 'BALLOON_POP' })
  @IsEnum(GameType)
  @IsNotEmpty()
  gameType: GameType;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty({ 
    example: { 
      message: 'ปีอมอลสม!', 
      balloonCount: 5, 
      colors: ['#FF6B9D', '#C44569'] 
    } 
  })
  @IsObject()
  @IsNotEmpty()
  config: Record<string, any>;
}
