// src/cards/dto/update-card.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsObject,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CardStatus } from '@prisma/client';

export class UpdateCardDto {
  @ApiPropertyOptional({ description: 'Tên thiệp' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

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

  @ApiPropertyOptional({ description: 'Nền canvas (JSON)' })
  @IsOptional()
  @IsObject()
  background?: object;

  @ApiPropertyOptional({ description: 'Cài đặt thiệp (JSON: nhạc nền, theme, font...)' })
  @IsOptional()
  @IsObject()
  settings?: object;

  @ApiPropertyOptional({ enum: CardStatus, description: 'Trạng thái thiệp' })
  @IsOptional()
  @IsEnum(CardStatus)
  status?: CardStatus;

  @ApiPropertyOptional({ description: 'Thiệp công khai hay không' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Mật khẩu xem thiệp (để trống = không cần mật khẩu)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  accessPassword?: string;

  @ApiPropertyOptional({ description: 'Ngày hết hạn (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
