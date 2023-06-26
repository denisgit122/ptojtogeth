import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateManagersDto {
  @ApiProperty({ example: 'Max' })
  @Length(2, 25)
  @IsString()
  name: string;

  @ApiProperty({ example: 'Ivanov' })
  @Length(5, 25)
  @IsString()
  surname: string;

  @ApiProperty({ example: 'max@gmail.com' })
  @IsEmail()
  @IsString()
  email: string;
}
