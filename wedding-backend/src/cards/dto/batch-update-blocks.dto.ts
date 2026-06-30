// src/cards/dto/batch-update-blocks.dto.ts
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// Một item trong batch update — có thể update geometry, content, style cùng lúc
export class BatchBlockItemDto {
  @ApiProperty({ description: 'ID của block cần cập nhật' })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ description: 'Vị trí X' })
  @IsOptional()
  @IsNumber()
  posX?: number;

  @ApiPropertyOptional({ description: 'Vị trí Y' })
  @IsOptional()
  @IsNumber()
  posY?: number;

  @ApiPropertyOptional({ description: 'Chiều rộng' })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({ description: 'Chiều cao' })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ description: 'Độ xoay' })
  @IsOptional()
  @IsNumber()
  rotation?: number;

  @ApiPropertyOptional({ description: 'z-index' })
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

  @ApiPropertyOptional({ description: 'Khoá block' })
  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;

  @ApiPropertyOptional({ description: 'Ẩn/hiện block' })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

export class BatchUpdateBlocksDto {
  @ApiProperty({ type: [BatchBlockItemDto], description: 'Danh sách block cần cập nhật' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchBlockItemDto)
  blocks: BatchBlockItemDto[];
}
