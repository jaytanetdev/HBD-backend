import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateRandomCardDto {
  @ApiProperty({ example: 'Moo Pung' })
  @IsString()
  @IsNotEmpty()
  recipientName: string;
}
