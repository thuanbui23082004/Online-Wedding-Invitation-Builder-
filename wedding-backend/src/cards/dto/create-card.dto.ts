// src/cards/dto/create-card.dto.ts
import {
  IsString,
  IsOptional,
  IsUUID,
  IsObject,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCardDto {
  @ApiPropertyOptional({ description: 'Tên thiệp (nội bộ)' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'ID template để clone (bỏ trống = thiệp trắng)' })
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @ApiPropertyOptional({ description: 'Tên chú rể' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  groomName?: string;

  @ApiPropertyOptional({ description: 'Tên cô dâu' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  brideName?: string;
}
