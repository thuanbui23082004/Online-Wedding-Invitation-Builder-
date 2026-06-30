// src/cards/dto/update-card-block.dto.ts
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BlockType } from '@prisma/client';

export class UpdateCardBlockDto {
  @ApiPropertyOptional({ description: 'Vị trí X trên canvas' })
  @IsOptional()
  @IsNumber()
  posX?: number;

  @ApiPropertyOptional({ description: 'Vị trí Y trên canvas' })
  @IsOptional()
  @IsNumber()
  posY?: number;

  @ApiPropertyOptional({ description: 'Chiều rộng block' })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({ description: 'Chiều cao block' })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ description: 'Độ xoay (degree)' })
  @IsOptional()
  @IsNumber()
  rotation?: number;

  @ApiPropertyOptional({ description: 'z-index lớp hiển thị' })
  @IsOptional()
  @IsInt()
  zIndex?: number;

  @ApiPropertyOptional({ description: 'Nội dung block (JSON)' })
  @IsOptional()
  @IsObject()
  content?: object;

  @ApiPropertyOptional({ description: 'Style block (JSON)' })
  @IsOptional()
  @IsObject()
  style?: object;

  @ApiPropertyOptional({ description: 'Khoá block (không cho di chuyển)' })
  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;

  @ApiPropertyOptional({ description: 'Ẩn/hiện block' })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
