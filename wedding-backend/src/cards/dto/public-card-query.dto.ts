// src/cards/dto/public-card-query.dto.ts
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PublicCardQueryDto {
  @ApiPropertyOptional({ description: 'Mật khẩu xem thiệp (nếu thiệp yêu cầu)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  password?: string;
}
