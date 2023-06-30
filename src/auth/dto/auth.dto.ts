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

  @ApiProperty({ required: true, example: "Password123@" })
  @IsString()
  @Length(5, 25)
  @IsNotEmpty()
  password: string;
}

export class PasswordDto {
  @ApiProperty({ required: true, example: "Password123@" })
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  @IsNotEmpty()
  password: string;
}

export class EmailDto {
  @ApiProperty({ example: 'max@gmail.com' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class ChangePasswordDto {
  @ApiProperty({ required: true, example: "Password123@" })
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ required: true, example: "Password123@" })
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  @IsNotEmpty()
  newPassword: string;
}
