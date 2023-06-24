import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateManagersDto {
  @ApiProperty({ example: 'Max' })
  @IsOptional()
  @Length(2, 25)
  @IsString()
  name: string;

  @ApiProperty({ example: 'Ivanov' })
  @IsOptional()
  @Length(5, 25)
  @IsString()
  surname: string;

  @ApiProperty({ example: 'max@gmail.com' })
  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;
}
