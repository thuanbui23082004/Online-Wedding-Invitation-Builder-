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

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { QueryCardDto } from './dto/query-card.dto';
import { CreateCardBlockDto } from './dto/create-card-block.dto';
import { UpdateCardBlockDto } from './dto/update-card-block.dto';
import { BatchUpdateBlocksDto } from './dto/batch-update-blocks.dto';
import { ReorderBlockDto, ReorderAction } from './dto/reorder-block.dto';
import { SaveCanvasDto } from './dto/save-canvas.dto';

// ── Tiện ích sinh slug ───────────────────────────────────────────────────────
function toSlugBase(text: string): string {
  // Chuyển tiếng Việt và ký tự đặc biệt thành slug Latin cơ bản
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // giữ lại chữ, số, dấu cách, gạch ngang
    .trim()
    .replace(/[\s-]+/g, '-'); // khoảng trắng -> gạch ngang
}

function randomSuffix(): string {
  return Math.random().toString(36).substring(2, 7); // 5 ký tự ngẫu nhiên
}

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  /**
   * Sinh slug duy nhất từ title, tự thêm suffix nếu trùng.
   * Thử tối đa 5 lần trước khi báo lỗi (trường hợp cực hiếm).
   */
  private async generateUniqueSlug(title: string): Promise<string> {
    const base = toSlugBase(title) || 'thep';
    for (let attempt = 0; attempt < 5; attempt++) {
      const slug = attempt === 0 ? base : `${base}-${randomSuffix()}`;
      const existing = await this.prisma.card.findUnique({ where: { slug } });
      if (!existing) return slug;
    }
    // Dùng timestamp làm fallback an toàn tuyệt đối
    return `${base}-${Date.now()}`;
  }

  /**
   * Kiểm tra card thuộc user đang request.
   * Ném ForbiddenException nếu không phải chủ sở hữu.
   */
  private async verifyCardOwner(cardId: string, userId: string) {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Không tìm thấy thiệp');
    if (card.userId !== userId)
      throw new ForbiddenException('Bạn không có quyền thao tác thiệp này');
    return card;
  }

  /**
   * Kiểm tra block thuộc đúng cardId VÀ cardId thuộc đúng userId.
   * 2 lớp kiểm tra tránh IDOR (user A đoán blockId của user B).
   */
  private async verifyBlockOwner(blockId: string, cardId: string, userId: string) {
    const block = await this.prisma.cardBlock.findUnique({ where: { id: blockId } });
    if (!block) throw new NotFoundException('Không tìm thấy block');
    if (block.cardId !== cardId)
      throw new ForbiddenException('Block không thuộc thiệp này');
    await this.verifyCardOwner(cardId, userId); // xác thực thêm lớp 2
    return block;
  }

  // ============================================================
  // 1. CARDS CRUD
  // ============================================================

  /**
   * Tạo thiệp mới.
   * Nếu có templateId → clone toàn bộ TemplateBlock vào CardBlock trong 1 transaction.
   * Nếu không → tạo thiệp trắng.
   */
  async createCard(dto: CreateCardDto, userId: string) {
    const slug = await this.generateUniqueSlug(dto.title);

    if (dto.templateId) {
      // ── Tạo từ template — wrapped trong transaction ──────────
      return this.prisma.$transaction(async (tx) => {
        // Lấy template và toàn bộ block của nó
        const template = await tx.template.findUnique({
          where: { id: dto.templateId },
          include: { blocks: { orderBy: { zIndex: 'asc' } } },
        });
        if (!template) throw new NotFoundException('Không tìm thấy template');
        if (template.status !== 'published')
          throw new BadRequestException('Template chưa được phát hành');

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
            settings: {},
          },
        });

        // Clone từng TemplateBlock → CardBlock
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

        // Tăng useCount của template
        await tx.template.update({
          where: { id: dto.templateId },
          data: { useCount: { increment: 1 } },
        });

        // Trả về card kèm blocks đã tạo
        return tx.card.findUnique({
          where: { id: card.id },
          include: { blocks: { orderBy: { zIndex: 'asc' } } },
        });
      });
    }

    // ── Tạo thiệp trắng (không có template) ──────────────────
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
   * Lấy danh sách thiệp của user với phân trang và bộ lọc.
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

    const [total, cards] = await this.prisma.$transaction([
      this.prisma.card.count({ where }),
      this.prisma.card.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
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
          _count: { select: { blocks: true } }, // đếm số block
        },
      }),
    ]);

    return {
      data: cards,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết thiệp + toàn bộ blocks (chỉ chủ sở hữu).
   */
  async getCardById(cardId: string, userId: string) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: { blocks: { orderBy: { zIndex: 'asc' } } },
    });
    if (!card) throw new NotFoundException('Không tìm thấy thiệp');
    if (card.userId !== userId)
      throw new ForbiddenException('Bạn không có quyền xem thiệp này');
    return card;
  }

  /**
   * Xem thiệp công khai qua slug — không cần đăng nhập.
   * Kiểm tra: published + isPublic + chưa hết hạn + mật khẩu (nếu có).
   */
  async getPublicCardBySlug(slug: string, password?: string) {
    const card = await this.prisma.card.findUnique({
      where: { slug },
      include: { blocks: { orderBy: { zIndex: 'asc' } } },
    });
    if (!card) throw new NotFoundException('Không tìm thấy thiệp');
    if (card.status !== CardStatus.published)
      throw new NotFoundException('Thiệp chưa được phát hành');
    if (!card.isPublic)
      throw new ForbiddenException('Thiệp này không công khai');
    if (card.expiresAt && new Date() > card.expiresAt)
      throw new ForbiddenException('Thiệp đã hết hạn');

    // Kiểm tra mật khẩu nếu thiệp có đặt mật khẩu
    if (card.accessPassword) {
      if (!password)
        throw new ForbiddenException('Thiệp này yêu cầu mật khẩu');
      const isMatch = await bcrypt.compare(password, card.accessPassword);
      if (!isMatch) throw new ForbiddenException('Mật khẩu không đúng');
    }

    // Ghi lượt xem bất đồng bộ (không block response)
    this.prisma.card
      .update({ where: { id: card.id }, data: { viewCount: { increment: 1 } } })
      .catch(() => {});

    // Trả về card nhưng ẩn accessPassword
    const { accessPassword: _, ...safeCard } = card;
    return safeCard;
  }

  /**
   * Cập nhật thông tin thiệp.
   * Tự set publishedAt nếu chuyển status sang published lần đầu.
   */
  async updateCard(cardId: string, userId: string, dto: UpdateCardDto) {
    const card = await this.verifyCardOwner(cardId, userId);

    let hashedPassword: string | undefined;
    if (dto.accessPassword !== undefined) {
      // Nếu truyền chuỗi rỗng → xoá mật khẩu
      hashedPassword =
        dto.accessPassword === '' ? undefined : await bcrypt.hash(dto.accessPassword, 10);
    }

    // Tự set publishedAt khi publish lần đầu
    const publishedAt =
      dto.status === CardStatus.published && !card.publishedAt ? new Date() : undefined;

    return this.prisma.card.update({
      where: { id: cardId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.groomName !== undefined && { groomName: dto.groomName }),
        ...(dto.brideName !== undefined && { brideName: dto.brideName }),
        ...(dto.background !== undefined && {
          background: dto.background as Prisma.InputJsonValue,
        }),
        ...(dto.settings !== undefined && {
          settings: dto.settings as Prisma.InputJsonValue,
        }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
        ...(dto.accessPassword !== undefined && {
          accessPassword: hashedPassword ?? null,
        }),
        ...(dto.expiresAt !== undefined && { expiresAt: new Date(dto.expiresAt) }),
        ...(publishedAt && { publishedAt }),
      },
    });
  }

  /**
   * Xóa cứng thiệp (cascade xóa luôn CardBlock theo schema).
   * Đề xuất cả 2 cách:
   *   - Soft delete: đổi status → archived (an toàn, khôi phục được)
   *   - Hard delete: xóa khỏi DB luôn (dùng hàm này)
   * FE gọi hàm nào tùy theo nhu cầu.
   */
  async deleteCard(cardId: string, userId: string) {
    await this.verifyCardOwner(cardId, userId);
    await this.prisma.card.delete({ where: { id: cardId } });
    return { message: 'Đã xóa thiệp thành công' };
  }

  /**
   * Soft delete: chuyển thiệp sang archived thay vì xóa cứng.
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
   * Tạo 1 block mới trên canvas.
   */
  async createBlock(cardId: string, userId: string, dto: CreateCardBlockDto) {
    // Xác thực card thuộc user
    await this.verifyCardOwner(cardId, userId);

    // Tính zIndex tự động nếu không truyền: đặt lên trên cùng hiện tại
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
        content: (dto.content ?? {}) as Prisma.InputJsonValue,
        style: (dto.style ?? {}) as Prisma.InputJsonValue,
        sourceElementId: dto.sourceElementId,
      },
    });
  }

  /**
   * Cập nhật 1 block (drag, resize, xoay, đổi nội dung...).
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
          content: dto.content as Prisma.InputJsonValue,
        }),
        ...(dto.style !== undefined && { style: dto.style as Prisma.InputJsonValue }),
        ...(dto.isLocked !== undefined && { isLocked: dto.isLocked }),
        ...(dto.isVisible !== undefined && { isVisible: dto.isVisible }),
      },
    });
  }

  /**
   * Cập nhật nhiều block cùng lúc trong 1 transaction.
   * Dùng cho multi-select drag, paste nhóm, undo-redo hàng loạt.
   */
  async batchUpdateBlocks(
    cardId: string,
    userId: string,
    dto: BatchUpdateBlocksDto,
  ) {
    // Xác thực card thuộc user
    await this.verifyCardOwner(cardId, userId);

    // Xác thực tất cả block đều thuộc card này (tránh IDOR)
    const blockIds = dto.blocks.map((b) => b.id);
    const existingBlocks = await this.prisma.cardBlock.findMany({
      where: { id: { in: blockIds }, cardId },
      select: { id: true },
    });
    if (existingBlocks.length !== blockIds.length) {
      throw new ForbiddenException('Một số block không thuộc thiệp này');
    }

    // Chạy toàn bộ update trong 1 transaction
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
              content: item.content as Prisma.InputJsonValue,
            }),
            ...(item.style !== undefined && {
              style: item.style as Prisma.InputJsonValue,
            }),
            ...(item.isLocked !== undefined && { isLocked: item.isLocked }),
            ...(item.isVisible !== undefined && { isVisible: item.isVisible }),
          },
        }),
      ),
    );
  }

  /**
   * Xóa 1 block khỏi canvas.
   */
  async deleteBlock(cardId: string, blockId: string, userId: string) {
    await this.verifyBlockOwner(blockId, cardId, userId);
    await this.prisma.cardBlock.delete({ where: { id: blockId } });
    return { message: 'Đã xóa block thành công' };
  }

  /**
   * Thay đổi thứ tự lớp (zIndex) của block.
   * action: front/back/forward/backward
   */
  async reorderBlock(
    cardId: string,
    blockId: string,
    userId: string,
    dto: ReorderBlockDto,
  ) {
    const block = await this.verifyBlockOwner(blockId, cardId, userId);

    // Lấy toàn bộ blocks của card, sắp xếp theo zIndex
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
        // Đặt lên trên cùng: zIndex = max + 1
        newZIndex = sorted[sorted.length - 1].zIndex + 1;
        break;
      case ReorderAction.BACK:
        // Đặt xuống dưới cùng: zIndex = min - 1 (tối thiểu 0)
        newZIndex = Math.max(0, sorted[0].zIndex - 1);
        break;
      case ReorderAction.FORWARD:
        // Lên 1 lớp: hoán đổi zIndex với block phía trên
        if (idx === sorted.length - 1) return block; // đã trên cùng
        newZIndex = sorted[idx + 1].zIndex;
        await this.prisma.cardBlock.update({
          where: { id: sorted[idx + 1].id },
          data: { zIndex: sorted[idx].zIndex }, // block phía trên xuống
        });
        break;
      case ReorderAction.BACKWARD:
        // Xuống 1 lớp: hoán đổi zIndex với block phía dưới
        if (idx === 0) return block; // đã dưới cùng
        newZIndex = sorted[idx - 1].zIndex;
        await this.prisma.cardBlock.update({
          where: { id: sorted[idx - 1].id },
          data: { zIndex: sorted[idx].zIndex }, // block phía dưới lên
        });
        break;
      default:
        throw new BadRequestException('Action không hợp lệ');
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
   * Endpoint lưu toàn bộ canvas mỗi 30s.
   * Pattern: FE gửi toàn bộ danh sách blocks hiện tại.
   * Backend sync theo cách:
   *   - Block có id hợp lệ UUID → UPDATE
   *   - Block có id tạm (el-xxx) hoặc không có id → CREATE
   *   - Block có trong DB nhưng không có trong payload → DELETE (đã bị FE xóa)
   * Toàn bộ nằm trong 1 transaction để đảm bảo atomic.
   */
  async saveCanvas(cardId: string, userId: string, dto: SaveCanvasDto) {
    await this.verifyCardOwner(cardId, userId);

    return this.prisma.$transaction(async (tx) => {
      // Lấy tất cả block hiện tại trong DB
      const existingBlocks = await tx.cardBlock.findMany({
        where: { cardId },
        select: { id: true },
      });
      const existingIds = new Set(existingBlocks.map((b) => b.id));

      // Phân loại block từ FE:
      //   - UUID hợp lệ có trong DB → update
      //   - UUID hợp lệ không có trong DB → tạo mới với id đó
      //   - id tạm (el-xxx, không phải UUID) → tạo mới
      const UUID_REGEX =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const payloadIds = new Set<string>(); // lưu id hợp lệ của payload để tính diff xóa

      for (const block of dto.blocks) {
        const isUUID = block.id && UUID_REGEX.test(block.id);

        if (isUUID && existingIds.has(block.id!)) {
          // UPDATE block đã có trong DB
          payloadIds.add(block.id!);
          await tx.cardBlock.update({
            where: { id: block.id },
            data: {
              blockType: block.blockType,
              posX: block.posX ?? 0,
              posY: block.posY ?? 0,
              width: block.width ?? 100,
              height: block.height ?? 100,
              rotation: block.rotation ?? 0,
              zIndex: block.zIndex ?? 0,
              content: (block.content ?? {}) as Prisma.InputJsonValue,
              style: (block.style ?? {}) as Prisma.InputJsonValue,
              isLocked: block.isLocked ?? false,
              isVisible: block.isVisible ?? true,
            },
          });
        } else {
          // CREATE block mới (id tạm hoặc chưa tồn tại trong DB)
          const created = await tx.cardBlock.create({
            data: {
              cardId,
              blockType: block.blockType,
              posX: block.posX ?? 0,
              posY: block.posY ?? 0,
              width: block.width ?? 100,
              height: block.height ?? 100,
              rotation: block.rotation ?? 0,
              zIndex: block.zIndex ?? 0,
              content: (block.content ?? {}) as Prisma.InputJsonValue,
              style: (block.style ?? {}) as Prisma.InputJsonValue,
              isLocked: block.isLocked ?? false,
              isVisible: block.isVisible ?? true,
              sourceElementId: block.sourceElementId,
              sourceTemplateBlockId: block.sourceTemplateBlockId,
            },
          });
          payloadIds.add(created.id);
        }
      }

      // DELETE các block có trong DB nhưng không có trong payload (FE đã xóa)
      const toDelete = [...existingIds].filter((id) => !payloadIds.has(id));
      if (toDelete.length > 0) {
        await tx.cardBlock.deleteMany({
          where: { id: { in: toDelete }, cardId },
        });
      }

      // Cập nhật background và settings của card
      await tx.card.update({
        where: { id: cardId },
        data: {
          ...(dto.background !== undefined && {
            background: dto.background as Prisma.InputJsonValue,
          }),
          ...(dto.settings !== undefined && {
            settings: dto.settings as Prisma.InputJsonValue,
          }),
        },
      });

      // Trả về trạng thái mới nhất của canvas
      return tx.card.findUnique({
        where: { id: cardId },
        include: { blocks: { orderBy: { zIndex: 'asc' } } },
      });
    });
  }
}
