// src/wishes/wishes.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishesService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================================
  // PRIVATE HELPERS
  // =========================================================================

  private async verifyWishOwner(wishId: string, userId: string) {
    const wish = await this.prisma.wish.findUnique({
      where: { id: wishId },
      include: { card: true },
    });
    if (!wish) throw new NotFoundException('Không tìm thấy lời chúc');
    if (wish.card.userId !== userId)
      throw new ForbiddenException('Không có quyền thao tác lời chúc này');
    return wish;
  }

  // =========================================================================
  // PUBLIC — không yêu cầu đăng nhập
  // =========================================================================

  /**
   * Gửi lời chúc công khai (khách mời gửi từ trang thiệp).
   */
  async submitWish(
    cardId: string,
    data: {
      displayName: string;
      message: string;
      avatarUrl?: string;
      side?: string;
    },
  ) {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Không tìm thấy thiệp cưới');

    return this.prisma.wish.create({
      data: {
        cardId,
        displayName: data.displayName,
        message: data.message,
        avatarUrl: data.avatarUrl,
        side: data.side || 'none',
        isApproved: false,
        isHidden: false,
      },
    });
  }

  // =========================================================================
  // PRIVATE — yêu cầu đăng nhập (chủ sở hữu thiệp)
  // =========================================================================

  /**
   * Lấy toàn bộ lời chúc của tất cả thiệp thuộc user.
   */
  async getAllWishes(userId: string) {
    return this.prisma.wish.findMany({
      where: { card: { userId } },
      include: {
        card: { select: { id: true, title: true } },
        guest: { select: { id: true, name: true, side: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lấy lời chúc của một thiệp cụ thể (chủ sở hữu thiệp).
   */
  async getWishesByCard(cardId: string, userId: string) {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Không tìm thấy thiệp');
    if (card.userId !== userId)
      throw new ForbiddenException('Bạn không có quyền xem thiệp này');

    return this.prisma.wish.findMany({
      where: { cardId },
      include: {
        guest: { select: { id: true, name: true, side: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Duyệt hoặc ẩn một lời chúc.
   */
  async approveWish(wishId: string, isApproved: boolean, userId: string) {
    await this.verifyWishOwner(wishId, userId);

    return this.prisma.wish.update({
      where: { id: wishId },
      data: {
        isApproved,
        isHidden: !isApproved,
      },
    });
  }

  /**
   * Xóa một lời chúc.
   */
  async deleteWish(wishId: string, userId: string) {
    await this.verifyWishOwner(wishId, userId);
    return this.prisma.wish.delete({ where: { id: wishId } });
  }
}
