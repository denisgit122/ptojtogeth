import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true, example: 'max@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @Length(5, 25)
  @IsNotEmpty()
  password: string;
}

export class PasswordDto {
  @ApiProperty({ required: true })
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  @IsNotEmpty()
  password: string;
}

export class EmailDto {
  @ApiProperty({ example: 'max@gmail.com' })
  @IsEmail()
  @IsString()
  email: string;
}
