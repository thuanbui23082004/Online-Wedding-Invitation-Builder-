// src/cards/dto/reorder-block.dto.ts
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ReorderAction {
  FRONT = 'front',     // Đưa lên trên cùng
  BACK = 'back',       // Đưa xuống dưới cùng
  FORWARD = 'forward', // Lên 1 lớp
  BACKWARD = 'backward', // Xuống 1 lớp
}

export class ReorderBlockDto {
  @ApiProperty({
    enum: ReorderAction,
    description: 'Hành động thay đổi thứ tự lớp: front/back/forward/backward',
  })
  @IsEnum(ReorderAction)
  action: ReorderAction;
}
