import { ApiProperty } from '@nestjs/swagger';
import { isNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserCreateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  age: number;

  city: string;
}
