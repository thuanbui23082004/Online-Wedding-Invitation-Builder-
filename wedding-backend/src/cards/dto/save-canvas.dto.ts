// src/cards/dto/save-canvas.dto.ts
// DTO đặc biệt cho endpoint "lưu canvas" — FE gọi mỗi 30s, gửi toàn bộ trạng thái hiện tại.
// Thiết kế theo pattern "upsert-by-id": gửi đủ blocks đang có,
// backend sẽ sync: thêm mới, cập nhật, xóa block không còn trong danh sách.

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlockType } from '@prisma/client';

// Đại diện 1 block gửi từ frontend editor
export class CanvasBlockDto {
  @ApiPropertyOptional({ description: 'UUID block (có = update, không có = tạo mới)' })
  @IsOptional()
  @IsString() // cho phép là string (không bắt UUID vì FE có thể dùng id tạm el-xxx)
  id?: string;

  @ApiProperty({ enum: BlockType })
  @IsEnum(BlockType)
  blockType: BlockType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  posX?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  posY?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rotation?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  zIndex?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  content?: object;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  style?: object;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'ID LibraryElement gốc nếu là element thư viện' })
  @IsOptional()
  @IsUUID()
  sourceElementId?: string;

  @ApiPropertyOptional({ description: 'ID TemplateBlock gốc nếu được clone từ template' })
  @IsOptional()
  @IsUUID()
  sourceTemplateBlockId?: string;
}

export class SaveCanvasDto {
  @ApiPropertyOptional({ description: 'Background của canvas (JSON)' })
  @IsOptional()
  @IsObject()
  background?: object;

  @ApiPropertyOptional({ description: 'Settings thiệp (JSON: nhạc, theme...)' })
  @IsOptional()
  @IsObject()
  settings?: object;

  @ApiProperty({ type: [CanvasBlockDto], description: 'Toàn bộ danh sách block hiện tại' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CanvasBlockDto)
  blocks: CanvasBlockDto[];
}
