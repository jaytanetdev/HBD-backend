import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class GameOrderItem {
  @ApiProperty({ example: 'game-id-123' })
  id: string;

  @ApiProperty({ example: 1 })
  order: number;
}

export class ReorderGamesDto {
  @ApiProperty({ 
    type: [GameOrderItem],
    example: [
      { id: 'game-1', order: 1 },
      { id: 'game-2', order: 2 },
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GameOrderItem)
  games: GameOrderItem[];
}
