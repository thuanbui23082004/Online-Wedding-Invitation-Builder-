// src/cards/dto/create-card-block.dto.ts
import {
  IsEnum,
  IsNumber,
  IsInt,
  IsOptional,
  IsObject,
  IsUUID,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlockType } from '@prisma/client';

export class CreateCardBlockDto {
  @ApiProperty({ enum: BlockType, description: 'Loại block' })
  @IsEnum(BlockType)
  blockType: BlockType;

  @ApiPropertyOptional({ description: 'Vị trí X trên canvas' })
  @IsOptional()
  @IsNumber()
  posX?: number = 0;

  @ApiPropertyOptional({ description: 'Vị trí Y trên canvas' })
  @IsOptional()
  @IsNumber()
  posY?: number = 0;

  @ApiPropertyOptional({ description: 'Chiều rộng block' })
  @IsOptional()
  @IsNumber()
  width?: number = 100;

  @ApiPropertyOptional({ description: 'Chiều cao block' })
  @IsOptional()
  @IsNumber()
  height?: number = 100;

  @ApiPropertyOptional({ description: 'Độ xoay (degree)' })
  @IsOptional()
  @IsNumber()
  rotation?: number = 0;

  @ApiPropertyOptional({ description: 'z-index lớp hiển thị' })
  @IsOptional()
  @IsInt()
  zIndex?: number = 0;

  @ApiPropertyOptional({ description: 'Nội dung block (JSON tự do theo blockType)' })
  @IsOptional()
  @IsObject()
  content?: object = {};

  @ApiPropertyOptional({ description: 'Style block (JSON: màu, font, shadow...)' })
  @IsOptional()
  @IsObject()
  style?: object = {};

  @ApiPropertyOptional({ description: 'ID LibraryElement gốc (nếu kéo từ thư viện)' })
  @IsOptional()
  @IsUUID()
  sourceElementId?: string;
}
