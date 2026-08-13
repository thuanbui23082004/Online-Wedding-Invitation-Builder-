// src/cards/cards.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CardStatus, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AssetsService } from '../assets/assets.service';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { QueryCardDto } from './dto/query-card.dto';
import { CreateCardBlockDto } from './dto/create-card-block.dto';
import { UpdateCardBlockDto } from './dto/update-card-block.dto';
import { BatchUpdateBlocksDto } from './dto/batch-update-blocks.dto';
import { ReorderBlockDto, ReorderAction } from './dto/reorder-block.dto';
import { SaveCanvasDto } from './dto/save-canvas.dto';

// ΓöÇΓöÇ Tiß╗çn ├¡ch sinh slug ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function toSlugBase(text: string): string {
  // Chuyß╗ân tiß║┐ng Viß╗çt v├á k├╜ tß╗▒ ─æß║╖c biß╗çt th├ánh slug Latin c╞í bß║ún
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bß╗Å dß║Ñu
    .replace(/─æ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // giß╗» lß║íi chß╗», sß╗æ, dß║Ñu c├ích, gß║ích ngang
    .trim()
    .replace(/[\s-]+/g, '-'); // khoß║úng trß║»ng -> gß║ích ngang
}

function randomSuffix(): string {
  return Math.random().toString(36).substring(2, 7); // 5 k├╜ tß╗▒ ngß║½u nhi├¬n
}

@Injectable()
export class CardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assetsService: AssetsService,
  ) { }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  /**
   * Sinh slug duy nhß║Ñt tß╗½ title, tß╗▒ th├¬m suffix nß║┐u tr├╣ng.
   * Thß╗¡ tß╗æi ─æa 5 lß║ºn tr╞░ß╗¢c khi b├ío lß╗ùi (tr╞░ß╗¥ng hß╗úp cß╗▒c hiß║┐m).
   */
  private async generateUniqueSlug(title: string): Promise<string> {
    const base = toSlugBase(title) || 'thep';
    for (let attempt = 0; attempt < 5; attempt++) {
      const slug = attempt === 0 ? base : `${base}-${randomSuffix()}`;
      const existing = await this.prisma.card.findUnique({ where: { slug } });
      if (!existing) return slug;
    }
    // D├╣ng timestamp l├ám fallback an to├án tuyß╗çt ─æß╗æi
    return `${base}-${Date.now()}`;
  }

  /**
   * Kiß╗âm tra card thuß╗Öc user ─æang request.
   * N├⌐m ForbiddenException nß║┐u kh├┤ng phß║úi chß╗º sß╗ƒ hß╗»u.
   */
  private async verifyCardOwner(cardId: string, userId: string) {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Kh├┤ng t├¼m thß║Ñy thiß╗çp');
    if (card.userId !== userId)
      throw new ForbiddenException('Bß║ín kh├┤ng c├│ quyß╗ün thao t├íc thiß╗çp n├áy');
    return card;
  }

  /**
   * Kiß╗âm tra block thuß╗Öc ─æ├║ng cardId V├Ç cardId thuß╗Öc ─æ├║ng userId.
   * 2 lß╗¢p kiß╗âm tra tr├ính IDOR (user A ─æo├ín blockId cß╗ºa user B).
   */
  private async verifyBlockOwner(
    blockId: string,
    cardId: string,
    userId: string,
  ) {
    const block = await this.prisma.cardBlock.findUnique({
      where: { id: blockId },
    });
    if (!block) throw new NotFoundException('Kh├┤ng t├¼m thß║Ñy block');
    if (block.cardId !== cardId)
      throw new ForbiddenException('Block kh├┤ng thuß╗Öc thiß╗çp n├áy');
    await this.verifyCardOwner(cardId, userId); // x├íc thß╗▒c th├¬m lß╗¢p 2
    return block;
  }

  // ============================================================
  // PUBLIC & STATS
  // ============================================================

  /**
   * Kiß╗âm tra slug hß╗úp lß╗ç v├á ch╞░a tß╗ôn tß║íi
   */
  async checkSlug(slug: string, excludeCardId?: string) {
    if (!slug || typeof slug !== 'string') return { isAvailable: false };
    const query: Prisma.CardWhereInput = { slug };
    if (excludeCardId) {
      query.id = { not: excludeCardId };
    }
    const existing = await this.prisma.card.findFirst({ where: query });
    return { isAvailable: !existing };
  }

  /**
   * Lß║Ñy thß╗æng k├¬ cß╗ºa mß╗Öt thiß╗çp (Chß╗ë chß╗º thiß╗çp)
   */
  async getCardStats(cardId: string, userId: string) {
    const card = await this.verifyCardOwner(cardId, userId);

    const [
      totalWishes,
      totalRsvps,
      totalGuestsInvited,
      attendingGroom,
      attendingBride,
      notAttending,
    ] = await Promise.all([
      this.prisma.wish.count({ where: { cardId } }),
      this.prisma.rsvpResponse.count({ where: { cardId } }),
      this.prisma.guest.count({ where: { cardId } }),
      this.prisma.rsvpResponse.count({
        where: {
          cardId,
          attending: 'yes',
          OR: [
            { guest: { side: 'groom' } },
            { note: { startsWith: 'Kh├ích nh├á trai' } }
          ]
        }
      }),
      this.prisma.rsvpResponse.count({
        where: {
          cardId,
          attending: 'yes',
          OR: [
            { guest: { side: 'bride' } },
            { note: { startsWith: 'Kh├ích nh├á g├íi' } }
          ]
        }
      }),
      this.prisma.rsvpResponse.count({
        where: { cardId, attending: 'no' }
      }),
    ]);

    return {
      viewCount: card.viewCount,
      totalWishes,
      totalRsvps,
      totalGuestsInvited,
      attendingGroom,
      attendingBride,
      notAttending,
    };
  }

  // ============================================================
  // 1. CARDS CRUD
  // ============================================================

  /**
   * Tß║ío thiß╗çp mß╗¢i.
   * Nß║┐u c├│ templateId ΓåÆ clone to├án bß╗Ö TemplateBlock v├áo CardBlock trong 1 transaction.
   * Nß║┐u kh├┤ng ΓåÆ tß║ío thiß╗çp trß║»ng.
   */
  async createCard(dto: CreateCardDto, userId: string) {
    const slug = await this.generateUniqueSlug(dto.title);

    if (dto.templateId) {
      // ΓöÇΓöÇ Tß║ío tß╗½ template ΓÇö wrapped trong transaction ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      return this.prisma.$transaction(async (tx) => {
        // Lß║Ñy template v├á to├án bß╗Ö block cß╗ºa n├│
        const template = await tx.template.findUnique({
          where: { id: dto.templateId },
          include: { blocks: { orderBy: { zIndex: 'asc' } } },
        });
        if (!template) throw new NotFoundException('Kh├┤ng t├¼m thß║Ñy template');
        if (template.status !== 'published')
          throw new BadRequestException('Template ch╞░a ─æ╞░ß╗úc ph├ít h├ánh');

        const templateBg = (template.background as any) || {};

        // Tạo Card kế thừa background + canvasWidth từ template
        const card = await tx.card.create({
          data: {
            userId,
            templateId: dto.templateId,
            slug,
            title: dto.title,
            groomName: dto.groomName,
            brideName: dto.brideName,
            background: template.background as Prisma.InputJsonValue,
            settings: {
              canvasWidth: template.canvasWidth,
              ...(templateBg.canvasHeight !== undefined && { canvasHeight: templateBg.canvasHeight }),
              ...(templateBg.autoScroll !== undefined && { autoScroll: templateBg.autoScroll }),
              ...(templateBg.autoScrollSpeed !== undefined && { autoScrollSpeed: templateBg.autoScrollSpeed }),
              ...(templateBg.coverPage !== undefined && { coverPage: templateBg.coverPage }),
              ...(templateBg.music !== undefined && { music: templateBg.music }),
            },
          },
        });

        // Clone tß╗½ng TemplateBlock ΓåÆ CardBlock
        if (template.blocks.length > 0) {
          await tx.cardBlock.createMany({
            data: template.blocks.map((tb) => ({
              cardId: card.id,
              sourceTemplateBlockId: tb.id,
              sourceElementId: tb.sourceElementId ?? undefined,
              blockType: tb.blockType,
              posX: tb.posX,
              posY: tb.posY,
              width: tb.width,
              height: tb.height,
              rotation: tb.rotation,
              zIndex: tb.zIndex,
              content: tb.content as Prisma.InputJsonValue,
              style: tb.style as Prisma.InputJsonValue,
              isLocked: tb.isLocked,
            })),
          });
        }

        // T─âng useCount + lß║Ñy card k├¿m blocks song song
        const [, cardWithBlocks] = await Promise.all([
          tx.template.update({
            where: { id: dto.templateId },
            data: { useCount: { increment: 1 } },
          }),
          tx.card.findUnique({
            where: { id: card.id },
            include: { blocks: { orderBy: { zIndex: 'asc' } } },
          }),
        ]);

        return cardWithBlocks;
      });
    }

    // ΓöÇΓöÇ Tß║ío thiß╗çp trß║»ng (kh├┤ng c├│ template) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    return this.prisma.card.create({
      data: {
        userId,
        slug,
        title: dto.title,
        groomName: dto.groomName,
        brideName: dto.brideName,
        background: { type: 'color', value: '#ffffff' },
        settings: {},
      },
      include: { blocks: true },
    });
  }

  /**
   * Lß║Ñy danh s├ích thiß╗çp cß╗ºa user vß╗¢i ph├ón trang v├á bß╗Ö lß╗ìc.
   */
  async getUserCards(userId: string, query: QueryCardDto) {
    const {
      status,
      search,
      page = 1,
      limit = 20,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = query;

    const where: Prisma.CardWhereInput = {
      userId,
      ...(status && { status }),
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),
    };

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;

    const [total, cards] = await this.prisma.$transaction([
      this.prisma.card.count({ where }),
      this.prisma.card.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        select: {
          id: true,
          slug: true,
          title: true,
          thumbnailUrl: true,
          groomName: true,
          brideName: true,
          status: true,
          isPublic: true,
          viewCount: true,
          publishedAt: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,
          templateId: true,
          template: {
            select: {
              thumbnailUrl: true,
            },
          },
          _count: { select: { blocks: true } }, // ─æß║┐m sß╗æ block
        },
      }),
    ]);

    return {
      data: cards,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  /**
   * Lß║Ñy chi tiß║┐t thiß╗çp + to├án bß╗Ö blocks (chß╗ë chß╗º sß╗ƒ hß╗»u).
   */
  async getCardById(cardId: string, userId: string) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: { blocks: { orderBy: { zIndex: 'asc' } } },
    });
    if (!card) throw new NotFoundException('Kh├┤ng t├¼m thß║Ñy thiß╗çp');
    if (card.userId !== userId)
      throw new ForbiddenException('Bß║ín kh├┤ng c├│ quyß╗ün xem thiß╗çp n├áy');
    return card;
  }

  /**
   * Xem thiß╗çp c├┤ng khai qua slug ΓÇö kh├┤ng cß║ºn ─æ─âng nhß║¡p.
   * Kiß╗âm tra: published + isPublic + ch╞░a hß║┐t hß║ín + mß║¡t khß║⌐u (nß║┐u c├│).
   */
  async getPublicCardBySlug(slug: string, password?: string) {
    const card = await this.prisma.card.findUnique({
      where: { slug },
      include: { blocks: { orderBy: { zIndex: 'asc' } } },
    });
    if (!card) throw new NotFoundException('Kh├┤ng t├¼m thß║Ñy thiß╗çp');
    if (card.status !== CardStatus.published)
      throw new NotFoundException('Thiß╗çp ch╞░a ─æ╞░ß╗úc ph├ít h├ánh');
    if (!card.isPublic)
      throw new ForbiddenException('Thiß╗çp n├áy kh├┤ng c├┤ng khai');
    if (card.expiresAt && new Date() > card.expiresAt)
      throw new ForbiddenException('Thiß╗çp ─æ├ú hß║┐t hß║ín');

    // Kiß╗âm tra mß║¡t khß║⌐u nß║┐u thiß╗çp c├│ ─æß║╖t mß║¡t khß║⌐u
    if (card.accessPassword) {
      if (!password) throw new ForbiddenException('Thiß╗çp n├áy y├¬u cß║ºu mß║¡t khß║⌐u');
      const isMatch = await bcrypt.compare(password, card.accessPassword);
      if (!isMatch) throw new ForbiddenException('Mß║¡t khß║⌐u kh├┤ng ─æ├║ng');
    }

    // Ghi l╞░ß╗út xem bß║Ñt ─æß╗ông bß╗Ö (kh├┤ng block response)
    this.prisma.card
      .update({ where: { id: card.id }, data: { viewCount: { increment: 1 } } })
      .catch(() => { });

    // Trß║ú vß╗ü card nh╞░ng ß║⌐n accessPassword
    const { accessPassword: _, ...safeCard } = card;
    return safeCard;
  }

  /**
   * Cß║¡p nhß║¡t th├┤ng tin thiß╗çp.
   * Tß╗▒ set publishedAt nß║┐u chuyß╗ân status sang published lß║ºn ─æß║ºu.
   */
  async updateCard(cardId: string, userId: string, dto: UpdateCardDto) {
    const card = await this.verifyCardOwner(cardId, userId);

    let hashedPassword: string | undefined;
    if (dto.accessPassword !== undefined) {
      // Nß║┐u truyß╗ün chuß╗ùi rß╗ùng ΓåÆ xo├í mß║¡t khß║⌐u
      hashedPassword =
        dto.accessPassword === ''
          ? undefined
          : await bcrypt.hash(dto.accessPassword, 10);
    }

    // Tß╗▒ set publishedAt khi publish lß║ºn ─æß║ºu
    const publishedAt =
      dto.status === CardStatus.published && !card.publishedAt
        ? new Date()
        : undefined;

    return this.prisma.card.update({
      where: { id: cardId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.groomName !== undefined && { groomName: dto.groomName }),
        ...(dto.brideName !== undefined && { brideName: dto.brideName }),
        ...(dto.background !== undefined && {
          background: dto.background,
        }),
        ...(dto.settings !== undefined && {
          settings: dto.settings,
        }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
        ...(dto.accessPassword !== undefined && {
          accessPassword: hashedPassword ?? null,
        }),
        ...(dto.expiresAt !== undefined && {
          expiresAt: new Date(dto.expiresAt),
        }),
        ...(publishedAt && { publishedAt }),
      },
    });
  }

  /**
   * X├│a cß╗⌐ng thiß╗çp (cascade x├│a lu├┤n CardBlock theo schema).
   * ─Éß╗ü xuß║Ñt cß║ú 2 c├ích:
   *   - Soft delete: ─æß╗òi status ΓåÆ archived (an to├án, kh├┤i phß╗Ñc ─æ╞░ß╗úc)
   *   - Hard delete: x├│a khß╗Åi DB lu├┤n (d├╣ng h├ám n├áy)
   * FE gß╗ìi h├ám n├áo t├╣y theo nhu cß║ºu.
   */
  async deleteCard(cardId: string, userId: string) {
    await this.verifyCardOwner(cardId, userId);
    await this.prisma.card.delete({ where: { id: cardId } });
    return { message: '─É├ú x├│a thiß╗çp th├ánh c├┤ng' };
  }

  /**
   * Soft delete: chuyß╗ân thiß╗çp sang archived thay v├¼ x├│a cß╗⌐ng.
   */
  async archiveCard(cardId: string, userId: string) {
    await this.verifyCardOwner(cardId, userId);
    return this.prisma.card.update({
      where: { id: cardId },
      data: { status: CardStatus.archived },
    });
  }

  // ============================================================
  // 2. CARD BLOCKS
  // ============================================================

  /**
   * Tß║ío 1 block mß╗¢i tr├¬n canvas.
   */
  async createBlock(cardId: string, userId: string, dto: CreateCardBlockDto) {
    // X├íc thß╗▒c card thuß╗Öc user
    await this.verifyCardOwner(cardId, userId);

    // T├¡nh zIndex tß╗▒ ─æß╗Öng nß║┐u kh├┤ng truyß╗ün: ─æß║╖t l├¬n tr├¬n c├╣ng hiß╗çn tß║íi
    let zIndex = dto.zIndex;
    if (zIndex === undefined || zIndex === 0) {
      const maxBlock = await this.prisma.cardBlock.findFirst({
        where: { cardId },
        orderBy: { zIndex: 'desc' },
      });
      zIndex = maxBlock ? maxBlock.zIndex + 1 : 0;
    }

    return this.prisma.cardBlock.create({
      data: {
        cardId,
        blockType: dto.blockType,
        posX: dto.posX ?? 0,
        posY: dto.posY ?? 0,
        width: dto.width ?? 100,
        height: dto.height ?? 100,
        rotation: dto.rotation ?? 0,
        zIndex,
        content: dto.content ?? {},
        style: dto.style ?? {},
        sourceElementId: dto.sourceElementId,
      },
    });
  }

  /**
   * Cß║¡p nhß║¡t 1 block (drag, resize, xoay, ─æß╗òi nß╗Öi dung...).
   */
  async updateBlock(
    cardId: string,
    blockId: string,
    userId: string,
    dto: UpdateCardBlockDto,
  ) {
    await this.verifyBlockOwner(blockId, cardId, userId);

    return this.prisma.cardBlock.update({
      where: { id: blockId },
      data: {
        ...(dto.posX !== undefined && { posX: dto.posX }),
        ...(dto.posY !== undefined && { posY: dto.posY }),
        ...(dto.width !== undefined && { width: dto.width }),
        ...(dto.height !== undefined && { height: dto.height }),
        ...(dto.rotation !== undefined && { rotation: dto.rotation }),
        ...(dto.zIndex !== undefined && { zIndex: dto.zIndex }),
        ...(dto.content !== undefined && {
          content: dto.content,
        }),
        ...(dto.style !== undefined && {
          style: dto.style,
        }),
        ...(dto.isLocked !== undefined && { isLocked: dto.isLocked }),
        ...(dto.isVisible !== undefined && { isVisible: dto.isVisible }),
      },
    });
  }

  /**
   * Cß║¡p nhß║¡t nhiß╗üu block c├╣ng l├║c trong 1 transaction.
   * D├╣ng cho multi-select drag, paste nh├│m, undo-redo h├áng loß║ít.
   */
  async batchUpdateBlocks(
    cardId: string,
    userId: string,
    dto: BatchUpdateBlocksDto,
  ) {
    // X├íc thß╗▒c card thuß╗Öc user
    await this.verifyCardOwner(cardId, userId);

    // X├íc thß╗▒c tß║Ñt cß║ú block ─æß╗üu thuß╗Öc card n├áy (tr├ính IDOR)
    const blockIds = dto.blocks.map((b) => b.id);
    const existingBlocks = await this.prisma.cardBlock.findMany({
      where: { id: { in: blockIds }, cardId },
      select: { id: true },
    });
    if (existingBlocks.length !== blockIds.length) {
      throw new ForbiddenException('Mß╗Öt sß╗æ block kh├┤ng thuß╗Öc thiß╗çp n├áy');
    }

    // Chß║íy to├án bß╗Ö update trong 1 transaction
    return this.prisma.$transaction(
      dto.blocks.map((item) =>
        this.prisma.cardBlock.update({
          where: { id: item.id },
          data: {
            ...(item.posX !== undefined && { posX: item.posX }),
            ...(item.posY !== undefined && { posY: item.posY }),
            ...(item.width !== undefined && { width: item.width }),
            ...(item.height !== undefined && { height: item.height }),
            ...(item.rotation !== undefined && { rotation: item.rotation }),
            ...(item.zIndex !== undefined && { zIndex: item.zIndex }),
            ...(item.content !== undefined && {
              content: item.content,
            }),
            ...(item.style !== undefined && {
              style: item.style,
            }),
            ...(item.isLocked !== undefined && { isLocked: item.isLocked }),
            ...(item.isVisible !== undefined && { isVisible: item.isVisible }),
          },
        }),
      ),
    );
  }

  /**
   * X├│a 1 block khß╗Åi canvas.
   */
  async deleteBlock(cardId: string, blockId: string, userId: string) {
    await this.verifyBlockOwner(blockId, cardId, userId);
    await this.prisma.cardBlock.delete({ where: { id: blockId } });
    return { message: '─É├ú x├│a block th├ánh c├┤ng' };
  }

  /**
   * Thay ─æß╗òi thß╗⌐ tß╗▒ lß╗¢p (zIndex) cß╗ºa block.
   * action: front/back/forward/backward
   */
  async reorderBlock(
    cardId: string,
    blockId: string,
    userId: string,
    dto: ReorderBlockDto,
  ) {
    const block = await this.verifyBlockOwner(blockId, cardId, userId);

    // Lß║Ñy to├án bß╗Ö blocks cß╗ºa card, sß║»p xß║┐p theo zIndex
    const allBlocks = await this.prisma.cardBlock.findMany({
      where: { cardId },
      orderBy: { zIndex: 'asc' },
    });

    const sorted = [...allBlocks];
    const idx = sorted.findIndex((b) => b.id === blockId);
    if (idx === -1) return block;

    let newZIndex: number;

    switch (dto.action) {
      case ReorderAction.FRONT:
        // ─Éß║╖t l├¬n tr├¬n c├╣ng: zIndex = max + 1
        newZIndex = sorted[sorted.length - 1].zIndex + 1;
        break;
      case ReorderAction.BACK:
        // ─Éß║╖t xuß╗æng d╞░ß╗¢i c├╣ng: zIndex = min - 1 (tß╗æi thiß╗âu 0)
        newZIndex = Math.max(0, sorted[0].zIndex - 1);
        break;
      case ReorderAction.FORWARD:
        // L├¬n 1 lß╗¢p: ho├ín ─æß╗òi zIndex vß╗¢i block ph├¡a tr├¬n
        if (idx === sorted.length - 1) return block; // ─æ├ú tr├¬n c├╣ng
        newZIndex = sorted[idx + 1].zIndex;
        await this.prisma.cardBlock.update({
          where: { id: sorted[idx + 1].id },
          data: { zIndex: sorted[idx].zIndex }, // block ph├¡a tr├¬n xuß╗æng
        });
        break;
      case ReorderAction.BACKWARD:
        // Xuß╗æng 1 lß╗¢p: ho├ín ─æß╗òi zIndex vß╗¢i block ph├¡a d╞░ß╗¢i
        if (idx === 0) return block; // ─æ├ú d╞░ß╗¢i c├╣ng
        newZIndex = sorted[idx - 1].zIndex;
        await this.prisma.cardBlock.update({
          where: { id: sorted[idx - 1].id },
          data: { zIndex: sorted[idx].zIndex }, // block ph├¡a d╞░ß╗¢i l├¬n
        });
        break;
      default:
        throw new BadRequestException('Action kh├┤ng hß╗úp lß╗ç');
    }

    return this.prisma.cardBlock.update({
      where: { id: blockId },
      data: { zIndex: newZIndex },
    });
  }

  // ============================================================
  // 3. SAVE CANVAS (30s auto-save)
  // ============================================================

  /**
   * Endpoint l╞░u to├án bß╗Ö canvas mß╗ùi 30s.
   * Pattern: FE gß╗¡i to├án bß╗Ö danh s├ích blocks hiß╗çn tß║íi.
   * Backend sync theo c├ích:
   *   - Block c├│ id hß╗úp lß╗ç UUID ΓåÆ UPDATE
   *   - Block c├│ id tß║ím (el-xxx) hoß║╖c kh├┤ng c├│ id ΓåÆ CREATE
   *   - Block c├│ trong DB nh╞░ng kh├┤ng c├│ trong payload ΓåÆ DELETE (─æ├ú bß╗ï FE x├│a)
   * To├án bß╗Ö nß║▒m trong 1 transaction ─æß╗â ─æß║úm bß║úo atomic.
   */
  async saveCanvas(cardId: string, userId: string, dto: SaveCanvasDto) {
    await this.verifyCardOwner(cardId, userId);

    const UUID_REGEX =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    return this.prisma.$transaction(
      async (tx) => {
        // Query 1: lß║Ñy existing IDs
        const existingBlocks = await tx.cardBlock.findMany({
          where: { cardId },
          select: { id: true },
        });
        const existingIds = new Set(existingBlocks.map((b) => b.id));

        // Ph├ón loß║íi
        const toUpdate: typeof dto.blocks = [];
        const toCreate: typeof dto.blocks = [];
        const payloadIds = new Set<string>();

        for (const block of dto.blocks) {
          const isUUID = block.id && UUID_REGEX.test(block.id);
          if (isUUID && existingIds.has(block.id!)) {
            payloadIds.add(block.id!);
            toUpdate.push(block);
          } else {
            toCreate.push(block);
          }
        }

        const toDelete = [...existingIds].filter((id) => !payloadIds.has(id));

        // Chß║íy song song: UPDATE bulk + CREATE bulk + DELETE + UPDATE card
        await Promise.all([
          // Query 2: UPDATE tß║Ñt cß║ú blocks bß║▒ng 1 raw SQL CASE WHEN
          toUpdate.length > 0
            ? tx.$executeRaw`
            UPDATE "card_blocks" SET
              "block_type"  = CASE "id" ${Prisma.join(toUpdate.map((b) => Prisma.sql`WHEN ${b.id}::uuid THEN ${b.blockType}::"BlockType"`), ' ')} END,
              "pos_x"       = CASE "id" ${Prisma.join(toUpdate.map((b) => Prisma.sql`WHEN ${b.id}::uuid THEN ${b.posX ?? 0}::float`), ' ')} END,
              "pos_y"       = CASE "id" ${Prisma.join(toUpdate.map((b) => Prisma.sql`WHEN ${b.id}::uuid THEN ${b.posY ?? 0}::float`), ' ')} END,
              "width"      = CASE "id" ${Prisma.join(toUpdate.map((b) => Prisma.sql`WHEN ${b.id}::uuid THEN ${b.width ?? 100}::float`), ' ')} END,
              "height"     = CASE "id" ${Prisma.join(toUpdate.map((b) => Prisma.sql`WHEN ${b.id}::uuid THEN ${b.height ?? 100}::float`), ' ')} END,
              "rotation"   = CASE "id" ${Prisma.join(toUpdate.map((b) => Prisma.sql`WHEN ${b.id}::uuid THEN ${b.rotation ?? 0}::float`), ' ')} END,
              "z_index"     = CASE "id" ${Prisma.join(toUpdate.map((b) => Prisma.sql`WHEN ${b.id}::uuid THEN ${b.zIndex ?? 0}::int`), ' ')} END,
              "is_locked"   = CASE "id" ${Prisma.join(toUpdate.map((b) => Prisma.sql`WHEN ${b.id}::uuid THEN ${b.isLocked ?? false}::boolean`), ' ')} END,
              "is_visible"  = CASE "id" ${Prisma.join(toUpdate.map((b) => Prisma.sql`WHEN ${b.id}::uuid THEN ${b.isVisible ?? true}::boolean`), ' ')} END,
              "content"    = CASE "id" ${Prisma.join(toUpdate.map((b) => Prisma.sql`WHEN ${b.id}::uuid THEN ${JSON.stringify(b.content ?? {})}::jsonb`), ' ')} END,
              "style"      = CASE "id" ${Prisma.join(toUpdate.map((b) => Prisma.sql`WHEN ${b.id}::uuid THEN ${JSON.stringify(b.style ?? {})}::jsonb`), ' ')} END,
              "updated_at"  = now()
            WHERE "id" IN (${Prisma.join(toUpdate.map((b) => Prisma.sql`${b.id}::uuid`))})
              AND "card_id" = ${cardId}::uuid
          `
            : Promise.resolve(),

          // Query 3: CREATE tß║Ñt cß║ú blocks mß╗¢i bß║▒ng 1 createMany
          toCreate.length > 0
            ? tx.cardBlock.createMany({
              data: toCreate.map((block) => ({
                cardId,
                blockType: block.blockType,
                posX: block.posX ?? 0,
                posY: block.posY ?? 0,
                width: block.width ?? 100,
                height: block.height ?? 100,
                rotation: block.rotation ?? 0,
                zIndex: block.zIndex ?? 0,
                content: block.content ?? {},
                style: block.style ?? {},
                isLocked: block.isLocked ?? false,
                isVisible: block.isVisible ?? true,
                sourceElementId: block.sourceElementId,
                sourceTemplateBlockId: block.sourceTemplateBlockId,
              })),
              skipDuplicates: true,
            })
            : Promise.resolve(),

          // Query 4: DELETE blocks ─æ├ú x├│a ß╗ƒ FE
          toDelete.length > 0
            ? tx.cardBlock.deleteMany({
              where: { id: { in: toDelete }, cardId },
            })
            : Promise.resolve(),

          // Query 5: UPDATE card background + settings
          tx.card.update({
            where: { id: cardId },
            data: {
              ...(dto.background !== undefined && {
                background: dto.background,
              }),
              ...(dto.settings !== undefined && {
                settings: dto.settings,
              }),
            },
          }),
        ]);

        // Query 6: trß║ú vß╗ü kß║┐t quß║ú mß╗¢i nhß║Ñt
        return tx.card.findUnique({
          where: { id: cardId },
          include: { blocks: { orderBy: { zIndex: 'asc' } } },
        });
      },
      {
        timeout: 10000, // t─âng nhß║╣ cho an to├án, thß╗▒c tß║┐ 6 queries xong rß║Ñt nhanh
        maxWait: 5000,
      },
    );
  }

  // ============================================================
  // THUMBNAIL
  // ============================================================

  /**
   * Upload thumbnail cho thiß╗çp
   */
  async uploadCardThumbnail(
    cardId: string,
    file: Express.Multer.File,
    userId: string,
  ) {
    const card = await this.verifyCardOwner(cardId, userId);

    if (card.thumbnailUrl) {
      await this.assetsService.deleteAssetByUrlSafe(card.thumbnailUrl, userId);
    }

    // Upload l├¬n Cloudinary (kh├┤ng l╞░u v├áo bß║úng assets cß╗ºa user)
    const asset = await this.assetsService.uploadSystemImage(file, userId);

    // Cập nhật URL vào template
    return this.prisma.card.update({
      where: { id: cardId },
      data: { thumbnailUrl: asset.url },
    });
  }

  // ==========================================
  // ADMIN METHODS
  // ==========================================

  async getAdminCards(query: any) {
    const { search, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      user: { role: { not: 'admin' } }
    };
    if (search) {
      where.AND = [
        {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { user: { email: { contains: search, mode: 'insensitive' } } },
            { user: { fullName: { contains: search, mode: 'insensitive' } } }
          ]
        }
      ];
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.card.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, fullName: true } },
        },
      }),
      this.prisma.card.count({ where }),
    ]);

    return {
      data: items.map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        status: c.status,
        isPublic: c.isPublic,
        viewCount: c.viewCount,
        createdAt: c.createdAt,
        user: c.user,
      })),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async updateCardVisibility(id: string, isPublic: boolean) {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) throw new NotFoundException('Card not found');

    return this.prisma.card.update({
      where: { id },
      data: { isPublic: (isPublic === true || String(isPublic) === 'true') },
    });
  }

  async deleteAdminCard(id: string) {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) throw new NotFoundException('Card not found');

    await this.prisma.card.delete({ where: { id } });
    return { message: 'Xóa thiệp thành công' };
  }
}
