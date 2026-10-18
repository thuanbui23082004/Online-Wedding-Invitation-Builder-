import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryTemplatesDto } from './dto/query-template.dto';
import {
  CreateAdminTemplateDto,
  UpdateAdminTemplateDto,
} from './dto/admin-template.dto';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assetsService: AssetsService,
  ) {}

  // GET /api/templates/categories
  async getPublicCategories() {
    return this.prisma.templateCategory.findMany({
      where: { parent: null }, // chỉ lấy category gốc (cấp 1)
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    });
  }

  // GET /api/templates?category=...&page=...&limit=...
  async getPublicTemplates(dto: QueryTemplatesDto) {
    const { category, page = 1, limit = 20 } = dto;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where = {
      status: 'published' as const,
      ...(category && {
        category: { slug: category },
      }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.template.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { useCount: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnailUrl: true,
          isPremium: true,
          useCount: true,
          category: { select: { name: true, slug: true } },
        },
        // KHÔNG select blocks ở đây — chỉ lấy khi user chọn template
      }),
      this.prisma.template.count({ where }),
    ]);

    return {
      items,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  // GET /api/templates/featured
  async getFeaturedTemplates() {
    return this.prisma.template.findMany({
      where: { status: 'published' },
      orderBy: { useCount: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        thumbnailUrl: true,
        isPremium: true,
        category: { select: { name: true, slug: true } },
      },
    });
  }

  // GET /api/templates/:id — trả canvas_data ĐẦY ĐỦ
  async getTemplateById(id: string) {
    const template = await this.prisma.template.findFirst({
      where: { id, status: 'published' },
      include: {
        blocks: {
          orderBy: { zIndex: 'asc' },
        },
        category: { select: { name: true, slug: true } },
      },
    });

    if (!template) return null;

    // Tăng use_count mỗi khi user load full template (chọn dùng)
    await this.prisma.template.update({
      where: { id },
      data: { useCount: { increment: 1 } },
    });

    return template;
  }

  // ==========================================
  // ADMIN METHODS
  // ==========================================

  async getAdminTemplates(query: any) {
    const { search, category, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (category) {
      where.category = { slug: category };
    }
    if (status) {
      where.status = status;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.template.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { displayOrder: 'desc' },
        include: {
          category: { select: { name: true } },
          creator: { select: { fullName: true, email: true } },
        },
      }),
      this.prisma.template.count({ where }),
    ]);

    return {
      items,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async createTemplate(dto: CreateAdminTemplateDto, userId: string) {
    return this.prisma.template.create({
      data: {
        ...dto,
        createdBy: userId,
      },
    });
  }

  async updateTemplate(id: string, dto: UpdateAdminTemplateDto) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template không tồn tại');

    return this.prisma.template.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTemplate(id: string) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template không tồn tại');

    await this.prisma.template.delete({ where: { id } });
    return { message: 'Đã xóa template thành công' };
  }

  async toggleTemplateStatus(id: string) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template không tồn tại');

    const newStatus = template.status === 'published' ? 'draft' : 'published';
    return this.prisma.template.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  async updateTemplateStatus(id: string, status: any) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template không tồn tại');

    return this.prisma.template.update({
      where: { id },
      data: { status },
    });
  }

  async updateTemplateOrder(id: string, displayOrder: number) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template không tồn tại');

    return this.prisma.template.update({
      where: { id },
      data: { displayOrder },
    });
  }

  async uploadTemplateThumbnail(
    id: string,
    file: Express.Multer.File,
    userId: string,
  ) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template không tồn tại');

    if (template.thumbnailUrl) {
      await this.assetsService.deleteAssetByUrlSafe(
        template.thumbnailUrl,
        userId,
      );
    }

    // Dùng AssetsService để upload lên Cloudinary (không lưu vào bảng assets của user)
    const asset = await this.assetsService.uploadSystemImage(file, userId);

    // Cập nhật URL vào template
    return this.prisma.template.update({
      where: { id },
      data: { thumbnailUrl: asset.url },
    });
  }

  // GET /api/admin/templates/:id/canvas — load đầy đủ kể cả draft
  async getTemplateForEditor(id: string) {
    const template = await this.prisma.template.findUnique({
      where: { id },
      include: {
        blocks: { orderBy: { zIndex: 'asc' } },
        category: { select: { name: true, slug: true } },
      },
    });
    if (!template) throw new NotFoundException('Template không tồn tại');
    return template;
  }

  // POST /api/admin/templates/:id/canvas — lưu blocks + background
  async saveTemplateCanvas(
    id: string,
    dto: { blocks: any[]; background?: object; canvasWidth?: number },
  ) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template không tồn tại');

    await this.prisma.$transaction(async (tx) => {
      // Chạy song song: xoá blocks cũ + cập nhật background
      await Promise.all([
        tx.templateBlock.deleteMany({ where: { templateId: id } }),
        dto.background || dto.canvasWidth
          ? tx.template.update({
              where: { id },
              data: {
                ...(dto.background && { background: dto.background }),
                ...(dto.canvasWidth && { canvasWidth: dto.canvasWidth }),
              },
            })
          : Promise.resolve(),
      ]);

      // Insert tất cả blocks mới (sau khi delete xong)
      if (dto.blocks && dto.blocks.length > 0) {
        await tx.templateBlock.createMany({
          data: dto.blocks.map((b: any) => ({
            templateId: id,
            blockType: b.blockType,
            posX: b.posX ?? 0,
            posY: b.posY ?? 0,
            width: b.width ?? 100,
            height: b.height ?? 100,
            rotation: b.rotation ?? 0,
            zIndex: b.zIndex ?? 0,
            content: b.content ?? {},
            style: b.style ?? {},
            isLocked: b.isLocked ?? false,
          })),
        });
      }
    });

    return { message: 'Đã lưu canvas template thành công' };
  }
}
