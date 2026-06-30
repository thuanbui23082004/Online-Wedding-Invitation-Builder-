// src/cards/cards.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CardsService } from './cards.service';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { QueryCardDto } from './dto/query-card.dto';
import { PublicCardQueryDto } from './dto/public-card-query.dto';
import { CreateCardBlockDto } from './dto/create-card-block.dto';
import { UpdateCardBlockDto } from './dto/update-card-block.dto';
import { BatchUpdateBlocksDto } from './dto/batch-update-blocks.dto';
import { ReorderBlockDto } from './dto/reorder-block.dto';
import { SaveCanvasDto } from './dto/save-canvas.dto';

// ── Interface mở rộng Request để TypeScript nhận req.user ──────────────────
interface AuthRequest extends Request {
  user: { id: string; email: string };
}

@ApiTags('Cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  // ==========================================================================
  // ROUTE PUBLIC — không cần JwtAuthGuard
  // Phải đặt TRƯỚC route :id để tránh conflict (NestJS match theo thứ tự)
  // ==========================================================================

  @Get('public/:slug')
  @ApiOperation({ summary: 'Xem thiệp công khai theo slug (không cần đăng nhập)' })
  getPublicCard(
    @Param('slug') slug: string,
    @Query() query: PublicCardQueryDto,
  ) {
    return this.cardsService.getPublicCardBySlug(slug, query.password);
  }

  // ==========================================================================
  // ROUTES PRIVATE — bắt buộc đăng nhập
  // ==========================================================================

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Tạo thiệp mới (từ template hoặc trắng)' })
  createCard(@Body() dto: CreateCardDto, @Req() req: AuthRequest) {
    return this.cardsService.createCard(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thiệp của tôi (có phân trang, bộ lọc)' })
  getUserCards(@Query() query: QueryCardDto, @Req() req: AuthRequest) {
    return this.cardsService.getUserCards(req.user.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết thiệp kèm blocks (chỉ chủ sở hữu)' })
  getCard(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ) {
    return this.cardsService.getCardById(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin thiệp' })
  updateCard(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCardDto,
    @Req() req: AuthRequest,
  ) {
    return this.cardsService.updateCard(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa cứng thiệp (hard delete, cascade blocks)' })
  deleteCard(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ) {
    return this.cardsService.deleteCard(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/archive')
  @ApiOperation({ summary: 'Soft delete: đổi thiệp sang trạng thái archived' })
  archiveCard(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ) {
    return this.cardsService.archiveCard(id, req.user.id);
  }

  // ==========================================================================
  // CANVAS AUTO-SAVE — FE gọi mỗi 30 giây
  // ==========================================================================

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/save')
  @ApiOperation({
    summary: 'Lưu toàn bộ canvas (auto-save 30s). Sync blocks: add/update/delete.',
  })
  saveCanvas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SaveCanvasDto,
    @Req() req: AuthRequest,
  ) {
    return this.cardsService.saveCanvas(id, req.user.id, dto);
  }

  // ==========================================================================
  // CARD BLOCKS
  // ==========================================================================

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':cardId/blocks')
  @ApiOperation({ summary: 'Thêm 1 block mới vào canvas' })
  createBlock(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Body() dto: CreateCardBlockDto,
    @Req() req: AuthRequest,
  ) {
    return this.cardsService.createBlock(cardId, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':cardId/blocks/batch')
  @ApiOperation({
    summary: 'Cập nhật nhiều block cùng lúc (multi-select drag, group move)',
  })
  batchUpdateBlocks(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Body() dto: BatchUpdateBlocksDto,
    @Req() req: AuthRequest,
  ) {
    return this.cardsService.batchUpdateBlocks(cardId, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':cardId/blocks/:blockId')
  @ApiOperation({ summary: 'Cập nhật 1 block (drag, resize, đổi nội dung...)' })
  updateBlock(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Param('blockId', ParseUUIDPipe) blockId: string,
    @Body() dto: UpdateCardBlockDto,
    @Req() req: AuthRequest,
  ) {
    return this.cardsService.updateBlock(cardId, blockId, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':cardId/blocks/:blockId')
  @ApiOperation({ summary: 'Xóa 1 block khỏi canvas' })
  deleteBlock(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Param('blockId', ParseUUIDPipe) blockId: string,
    @Req() req: AuthRequest,
  ) {
    return this.cardsService.deleteBlock(cardId, blockId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':cardId/blocks/:blockId/reorder')
  @ApiOperation({
    summary: 'Thay đổi thứ tự lớp block (front/back/forward/backward)',
  })
  reorderBlock(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Param('blockId', ParseUUIDPipe) blockId: string,
    @Body() dto: ReorderBlockDto,
    @Req() req: AuthRequest,
  ) {
    return this.cardsService.reorderBlock(cardId, blockId, req.user.id, dto);
  }
}
