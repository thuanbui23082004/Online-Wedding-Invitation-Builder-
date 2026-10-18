// src/library-elements/library-elements.service.ts
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  v2 as Cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateLibraryElementDto,
  UpdateLibraryElementDto,
  LibraryElementQueryDto,
} from './dto/library-element.dto';
import {
  CreateElementCategoryDto,
  UpdateElementCategoryDto,
} from './dto/element-category.dto';

@Injectable()
export class LibraryElementsService {
  constructor(
    @Inject('CLOUDINARY') private cloudinary: typeof Cloudinary,
    private prisma: PrismaService,
  ) {}

  // ─── Cloudinary helper ────────────────────────────────────────────────────

  private uploadToCloudinary(
    fileBuffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          // Tạo thumbnail tự động
          eager: [
            {
              width: 300,
              height: 300,
              crop: 'pad',
              background: 'transparent',
              format: 'png',
            },
          ],
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/upload/');
    if (parts.length < 2) return '';
    let path = parts[1];
    if (/^v\d+\//.test(path)) path = path.replace(/^v\d+\//, '');
    return path.replace(/\.[^/.]+$/, '');
  }

  // ─── Categories ───────────────────────────────────────────────────────────

  async getCategories() {
    return this.prisma.elementCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { elements: { where: { status: 'published' } } } },
      },
    });
  }

  async getCategoryById(id: string) {
    const cat = await this.prisma.elementCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Không tìm thấy danh mục');
    return cat;
  }

  async createCategory(dto: CreateElementCategoryDto, _userId?: string) {
    const existing = await this.prisma.elementCategory.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) throw new ConflictException('Slug danh mục đã tồn tại');
    return this.prisma.elementCategory.create({ data: { ...dto } });
  }

  async updateCategory(id: string, dto: UpdateElementCategoryDto) {
    await this.getCategoryById(id);
    if (dto.slug) {
      const existing = await this.prisma.elementCategory.findFirst({
        where: { slug: dto.slug, NOT: { id } },
      });
      if (existing) throw new ConflictException('Slug danh mục đã tồn tại');
    }
    return this.prisma.elementCategory.update({ where: { id }, data: dto });
  }

  async deleteCategory(id: string) {
    await this.getCategoryById(id);
    // Chuyển elements trong danh mục về uncategorized
    await this.prisma.libraryElement.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });
    await this.prisma.elementCategory.delete({ where: { id } });
    return { message: 'Đã xóa danh mục thành công' };
  }

  // ─── Elements (public) ────────────────────────────────────────────────────

  async getElements(query: LibraryElementQueryDto, adminMode = false) {
    const {
      search,
      categoryId,
      elementType,
      isPremium,
      status,
      page = 1,
      limit = 48,
    } = query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 48;

    const where: any = {};

    // Admin xem mọi status; user chỉ xem published
    if (!adminMode) {
      where.status = 'published';
    } else if (status) {
      where.status = status;
    }

    if (categoryId) where.categoryId = categoryId;
    if (elementType) where.elementType = elementType;
    if (typeof isPremium === 'boolean') where.isPremium = isPremium;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [data, total] = await Promise.all([
      this.prisma.libraryElement.findMany({
        where,
        orderBy: [{ usageCount: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limitNumber,
        include: {
          category: { select: { id: true, name: true } },
        },
      }),
      this.prisma.libraryElement.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async getElementById(id: string) {
    const el = await this.prisma.libraryElement.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });
    if (!el) throw new NotFoundException('Không tìm thấy element');
    return el;
  }

  async incrementUsage(id: string) {
    await this.prisma.libraryElement.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
    return { message: 'OK' };
  }

  // ─── Elements (admin) ─────────────────────────────────────────────────────

  async createElement(dto: CreateLibraryElementDto, userId: string) {
    return this.prisma.libraryElement.create({
      data: {
        name: dto.name,
        elementType: dto.elementType as any,
        categoryId: dto.categoryId ?? null,
        tags: dto.tags ?? [],
        isPremium: dto.isPremium ?? false,
        requiredPlanId: dto.requiredPlanId ?? null,
        isRecolorable: dto.isRecolorable ?? false,
        fileUrl: '', // sẽ upload sau
        status: 'draft',
        createdBy: userId,
      },
    });
  }

  async uploadElementFile(
    id: string,
    file: Express.Multer.File,
    _userId?: string,
  ) {
    const el = await this.getElementById(id);

    // Xóa file cũ trên Cloudinary nếu có
    if (el.fileUrl) {
      try {
        const publicId = this.extractPublicId(el.fileUrl);
        await this.cloudinary.uploader.destroy(publicId, {
          resource_type: 'image',
        });
      } catch {
        // ignore error if old file not found on Cloudinary
      }
    }

    let result: UploadApiResponse;
    try {
      result = await this.uploadToCloudinary(
        file.buffer,
        `dearlove/library_elements`,
      );
    } catch (error: any) {
      throw new BadRequestException(
        error.message || 'Lỗi upload file lên Cloudinary',
      );
    }

    const thumbnailUrl = result.eager?.[0]?.secure_url ?? result.secure_url;

    return this.prisma.libraryElement.update({
      where: { id },
      data: {
        fileUrl: result.secure_url,
        thumbnailUrl,
        width: result.width ?? null,
        height: result.height ?? null,
      },
    });
  }

  async updateElement(id: string, dto: UpdateLibraryElementDto) {
    await this.getElementById(id);
    return this.prisma.libraryElement.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.elementType && { elementType: dto.elementType as any }),
        ...(dto.categoryId !== undefined && {
          categoryId: dto.categoryId ?? null,
        }),
        ...(dto.tags && { tags: dto.tags }),
        ...(typeof dto.isPremium === 'boolean' && { isPremium: dto.isPremium }),
        ...(dto.requiredPlanId !== undefined && {
          requiredPlanId: dto.requiredPlanId ?? null,
        }),
        ...(typeof dto.isRecolorable === 'boolean' && {
          isRecolorable: dto.isRecolorable,
        }),
      },
    });
  }

  async deleteElement(id: string) {
    const el = await this.getElementById(id);

    // Xóa file Cloudinary
    if (el.fileUrl) {
      try {
        const publicId = this.extractPublicId(el.fileUrl);
        await this.cloudinary.uploader.destroy(publicId, {
          resource_type: 'image',
        });
      } catch {
        // ignore error if file not found on Cloudinary
      }
    }

    await this.prisma.libraryElement.delete({ where: { id } });
    return { message: 'Đã xóa element thành công' };
  }

  async toggleElementStatus(id: string) {
    const el = await this.getElementById(id);
    const newStatus = el.status === 'published' ? 'draft' : 'published';

    // Validate: cần có fileUrl trước khi publish
    if (newStatus === 'published' && !el.fileUrl) {
      throw new BadRequestException(
        'Vui lòng upload file trước khi publish element',
      );
    }

    return this.prisma.libraryElement.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}
