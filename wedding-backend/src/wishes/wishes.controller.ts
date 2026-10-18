// src/wishes/wishes.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WishesService } from './wishes.service';

interface AuthRequest extends Request {
  user: { id: string; email: string };
}

@ApiTags('Wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  // ==========================================================================
  // ROUTE PUBLIC — không cần JwtAuthGuard
  // ==========================================================================

  @Post('public/:cardId')
  @ApiOperation({ summary: 'Gửi lời chúc công khai (không cần đăng nhập)' })
  submitWish(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Body()
    data: {
      displayName: string;
      message: string;
      avatarUrl?: string;
      side?: string;
    },
  ) {
    return this.wishesService.submitWish(cardId, data);
  }

  // ==========================================================================
  // ROUTES PRIVATE — bắt buộc đăng nhập
  // ==========================================================================

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách lời chúc của user' })
  getAllWishes(@Req() req: AuthRequest) {
    return this.wishesService.getAllWishes(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('card/:cardId')
  @ApiOperation({ summary: 'Lấy lời chúc của một thiệp cụ thể' })
  getWishesByCard(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.wishesService.getWishesByCard(cardId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':wishId/approve')
  @ApiOperation({ summary: 'Duyệt hoặc ẩn lời chúc' })
  approveWish(
    @Param('wishId', ParseUUIDPipe) wishId: string,
    @Body() body: { isApproved: boolean },
    @Req() req: AuthRequest,
  ) {
    return this.wishesService.approveWish(wishId, body.isApproved, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':wishId')
  @ApiOperation({ summary: 'Xóa lời chúc' })
  deleteWish(
    @Param('wishId', ParseUUIDPipe) wishId: string,
    @Req() req: AuthRequest,
  ) {
    return this.wishesService.deleteWish(wishId, req.user.id);
  }
}
