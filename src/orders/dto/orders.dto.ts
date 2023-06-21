import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ECourse, ECourse_format, ECourse_type, EStatus } from '../interface';

export class UpdateOrdersDto {
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

  @ApiProperty({ example: '+380991568912' })
  @IsOptional()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
  @IsString()
  phone?: string;

  @ApiProperty({ example: 24 })
  @IsOptional()
  @Min(15)
  @Max(100)
  @IsNumber()
  age?: number;

  @ApiProperty({ enum: ECourse })
  @IsOptional()
  @IsString()
  @IsEnum(ECourse)
  course?: string;

  @ApiProperty({ enum: ECourse_type })
  @IsOptional()
  @IsString()
  @IsEnum(ECourse_type)
  course_type?: string;

  @ApiProperty({ enum: ECourse_format })
  @IsOptional()
  @IsString()
  @IsEnum(ECourse_format)
  course_format?: string;

  @ApiProperty({ enum: EStatus })
  @IsOptional()
  @IsString()
  @IsEnum(EStatus)
  status?: string;

  @ApiProperty({ example: 30000 })
  @IsOptional()
  @Max(100000)
  @IsNumber()
  sum?: number;

  @ApiProperty({ example: 1000 })
  @IsOptional()
  @Max(100000)
  @IsNumber()
  already_paid?: number;

  @ApiProperty({ example: 'sep-2022' })
  @IsOptional()
  @Length(5, 25)
  @IsString()
  group?: string;

  @ApiProperty({ example: 'Sasha' })
  @IsOptional()
  @Length(5, 25)
  @IsString()
  manager?: string;
}

export class AddCommentDto {
  @ApiProperty({ example: 'Hello World!' })
  @IsOptional()
  @Length(5, 100)
  @IsString()
  comment: string;
}

export class CreateGroupDto {
  @ApiProperty({ example: 'sept-2022' })
  @IsOptional()
  @Length(5, 100)
  @IsString()
  name: string;
}
