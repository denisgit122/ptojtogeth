import { ApiProperty } from '@nestjs/swagger';
import {IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsString, Length, Matches} from 'class-validator';
import {EStatusManager} from "../interface";

export class CreateManagerDto {
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

export class UpdateManagerDto {
  @ApiProperty({ example: 'Max' })
  @IsOptional()
  @Length(2, 25)
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Ivanov' })
  @IsOptional()
  @Length(5, 25)
  @IsString()
  surname?: string;

  @ApiProperty({ example: 'max@gmail.com' })
  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @ApiProperty({ enum: EStatusManager })
  @IsOptional()
  @IsString()
  @IsEnum(EStatusManager)
  status?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ example: "2022-05-30T17:06:14Z" })
  @IsOptional()
  @IsDate()
  last_login?: Date;

  @ApiProperty({ example: "Password123@" })
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  password?: string;
}
