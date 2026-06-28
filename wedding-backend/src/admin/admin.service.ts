import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ── Thống kê tổng quan ─────────────────────────────────────────────
  async getStats() {
    const [totalUsers, totalCards, totalWishes, totalRsvps] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.card.count(),
      this.prisma.wish.count(),
      this.prisma.rsvpResponse.count(),
    ]);

    return {
      totalUsers,
      totalCards,
      totalWishes,
      totalRsvps,
    };
  }

  // ── Người dùng ─────────────────────────────────────────────────────
  async getUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        status: true,
        authProvider: true,
        createdAt: true,
        currentPlan: { select: { name: true } },
        _count: { select: { cards: true } },
      },
    });
  }

  async updateUserStatus(id: string, status: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  // ── Templates ──────────────────────────────────────────────────────
  async getTemplates() {
    return this.prisma.template.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        thumbnailUrl: true,
        isPremium: true,
        status: true,
        useCount: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { name: true } },
        requiredPlan: { select: { name: true } },
      },
    });
  }

  async createTemplate(data: {
    name: string;
    slug: string;
    isPremium: boolean;
    thumbnailUrl?: string;
    categoryId?: string;
  }) {
    return this.prisma.template.create({ data });
  }

  async updateTemplate(id: string, data: Partial<{
    name: string;
    status: string;
    isPremium: boolean;
    thumbnailUrl: string;
  }>) {
    return this.prisma.template.update({
      where: { id },
      data: data as any,
    });
  }

  async deleteTemplate(id: string) {
    return this.prisma.template.delete({ where: { id } });
  }

  // ── Cards ──────────────────────────────────────────────────────────
  async getCards() {
    return this.prisma.card.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        groomName: true,
        brideName: true,
        status: true,
        viewCount: true,
        createdAt: true,
        user: { select: { fullName: true, email: true } },
        template: { select: { name: true } },
        _count: { select: { guests: true, rsvps: true, wishes: true } },
      },
    });
  }

  // ── Wishes ─────────────────────────────────────────────────────────
  async getWishes() {
    return this.prisma.wish.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        displayName: true,
        message: true,
        isApproved: true,
        isHidden: true,
        createdAt: true,
        card: { select: { title: true, slug: true } },
      },
    });
  }

  async updateWish(id: string, data: { isApproved?: boolean; isHidden?: boolean }) {
    return this.prisma.wish.update({ where: { id }, data });
  }

  // ── Plans ──────────────────────────────────────────────────────────
  async getPlans() {
    return this.prisma.plan.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { users: true } } },
    });
  }

  async createPlan(data: {
    name: string;
    price: number;
    durationDays?: number;
    maxCards?: number;
    features?: object;
  }) {
    return this.prisma.plan.create({ data: data as any });
  }

  async updatePlan(id: string, data: Partial<{
    name: string;
    price: number;
    durationDays: number;
    maxCards: number;
    isActive: boolean;
    features: object;
  }>) {
    return this.prisma.plan.update({ where: { id }, data: data as any });
  }
}