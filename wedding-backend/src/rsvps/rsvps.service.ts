// src/rsvps/rsvps.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { GuestSide, RsvpStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface RsvpEntryDto {
  guestName?: string;
  phone?: string;
  side?: string;
  attending?: string;
  numAttendees?: number;
  note?: string;
}

export interface SubmitRsvpDto extends RsvpEntryDto {
  entries?: RsvpEntryDto[];
}

function parseSide(side?: string): GuestSide | null {
  if (side === 'groom') return GuestSide.groom;
  if (side === 'bride') return GuestSide.bride;
  if (side === 'both') return GuestSide.both;
  return null;
}

function parseAttending(attending?: string): RsvpStatus {
  if (attending === 'no') return RsvpStatus.no;
  if (attending === 'maybe') return RsvpStatus.maybe;
  return RsvpStatus.yes;
}

@Injectable()
export class RsvpsService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================================
  // PUBLIC — không yêu cầu đăng nhập
  // =========================================================================

  /**
   * Gửi xác nhận tham dự (RSVP) từ trang thiệp công khai.
   * Hỗ trợ submit cả Nhà trai và Nhà gái trong cùng 1 request bằng cách
   * truyền mảng `entries` hoặc các trường riêng lẻ.
   */
  async submitRsvp(cardId: string, data: SubmitRsvpDto) {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Không tìm thấy thiệp cưới');

    // Hỗ trợ submit nhiều RSVP một lúc (Nhà trai + Nhà gái)
    if (Array.isArray(data.entries)) {
      const records = await Promise.all(
        data.entries.map((entry: RsvpEntryDto) =>
          this.prisma.rsvpResponse.create({
            data: {
              cardId,
              guestName: (entry.guestName ?? data.guestName) || 'Khách mời',
              phone: entry.phone ?? data.phone,
              side: parseSide(entry.side),
              attending: parseAttending(entry.attending),
              numAttendees: entry.numAttendees || 1,
              note: entry.note,
            },
          }),
        ),
      );
      return records;
    }

    // Single RSVP entry (backward compatible)
    return this.prisma.rsvpResponse.create({
      data: {
        cardId,
        guestName: data.guestName || 'Khách mời',
        phone: data.phone,
        side: parseSide(data.side),
        attending: parseAttending(data.attending),
        numAttendees: data.numAttendees || 1,
        note: data.note,
      },
    });
  }

  // =========================================================================
  // PRIVATE — yêu cầu đăng nhập (chủ sở hữu thiệp)
  // =========================================================================

  /**
   * Lấy toàn bộ danh sách RSVP của tất cả thiệp thuộc user.
   */
  async getAllRsvps(userId: string) {
    return this.prisma.rsvpResponse.findMany({
      where: { card: { userId } },
      include: {
        card: { select: { title: true } },
        guest: { select: { side: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lấy danh sách RSVP của một thiệp cụ thể.
   */
  async getRsvpsByCard(cardId: string, userId: string) {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Không tìm thấy thiệp');

    return this.prisma.rsvpResponse.findMany({
      where: { cardId, card: { userId } },
      include: {
        guest: { select: { side: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
