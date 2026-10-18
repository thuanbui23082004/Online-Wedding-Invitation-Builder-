import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateCurrentPlanId(
    currentPlanId: string | null | undefined,
  ): Promise<string | null> {
    if (!currentPlanId) {
      return null;
    }

    const normalizedPlanId = currentPlanId.trim();
    if (!normalizedPlanId) {
      return null;
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: normalizedPlanId },
    });

    if (!plan) {
      throw new BadRequestException(
        `Invalid currentPlanId: plan ${normalizedPlanId} not found`,
      );
    }

    return normalizedPlanId;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, email, phone, currentPlanId, ...rest } = createUserDto;

    // Check for unique email
    if (email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException(
          'Email đã tồn tại. Vui vòng nhập email khác!',
        );
      }
    }

    // Check for unique phone
    if (phone) {
      const existingUser = await this.prisma.user.findUnique({
        where: { phone },
      });
      if (existingUser) {
        throw new ConflictException('Phone number already exists');
      }
    }

    let passwordHash: string | null = null;
    if (password) {
      const salt = await bcrypt.genSalt();
      passwordHash = await bcrypt.hash(password, salt);
    }

    const normalizedCurrentPlanId =
      await this.validateCurrentPlanId(currentPlanId);

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        email: email || null,
        phone: phone || null,
        passwordHash,
        currentPlanId: normalizedCurrentPlanId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        currentPlanId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new User(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new User(user));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new User(user);
  }
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }
    return new User(user);
  }

  async checkUserPassword(password: string, hash: string | null) {
    if (!hash) {
      return false;
    }
    return await bcrypt.compare(password, hash);
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Ensure user exists
    await this.findOne(id);

    const { password, email, phone, currentPlanId, ...rest } = updateUserDto;

    // Check unique email if changing
    if (email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { email, NOT: { id } },
      });
      if (existingUser) {
        throw new ConflictException(
          'Email đã tồn tại. Vui vòng nhập email khác!',
        );
      }
    }

    // Check unique phone if changing
    if (phone) {
      const existingUser = await this.prisma.user.findFirst({
        where: { phone, NOT: { id } },
      });
      if (existingUser) {
        throw new ConflictException('Phone number already exists');
      }
    }

    const dataToUpdate: any = { ...rest };
    if (email !== undefined) dataToUpdate.email = email || null;
    if (phone !== undefined) dataToUpdate.phone = phone || null;
    if (currentPlanId !== undefined) {
      dataToUpdate.currentPlanId =
        await this.validateCurrentPlanId(currentPlanId);
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      dataToUpdate.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return new User(updatedUser);
  }

  async remove(id: string): Promise<User> {
    // Ensure user exists
    await this.findOne(id);

    const deletedUser = await this.prisma.user.delete({ where: { id } });
    return new User(deletedUser);
  }

  async updateUserToken(
    refreshToken: string | null,
    userId: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async findUserByToken(refreshToken: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { refreshToken },
    });
    return user ? new User(user) : null;
  }

  // =====================================================================
  // ĐĂNG NHẬP MẠNG XÃ HỘI (GOOGLE & FACEBOOK) - TÌM HOẶC TẠO NGƯỜI DÙNG OAUTH
  // =====================================================================
  async findOrCreateOAuthUser(profile: {
    email: string | null;
    fullName: string;
    avatarUrl: string | null;
    providerId: string;
    authProvider: 'google' | 'facebook';
  }): Promise<User> {
    // 1. Tìm user theo providerId và authProvider
    if (profile.providerId) {
      const user = await this.prisma.user.findFirst({
        where: {
          providerId: profile.providerId,
          authProvider: profile.authProvider,
        },
      });
      if (user) {
        if (profile.avatarUrl && user.avatarUrl !== profile.avatarUrl) {
          const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: { avatarUrl: profile.avatarUrl },
          });
          return new User(updatedUser);
        }
        return new User(user);
      }
    }

    // 2. Nếu tìm thấy email đã tồn tại ở tài khoản khác, liên kết providerId vào tài khoản đó
    if (profile.email) {
      const userByEmail = await this.prisma.user.findUnique({
        where: { email: profile.email },
      });
      if (userByEmail) {
        const updatedUser = await this.prisma.user.update({
          where: { id: userByEmail.id },
          data: {
            providerId: profile.providerId,
            authProvider: profile.authProvider,
            avatarUrl: userByEmail.avatarUrl || profile.avatarUrl,
          },
        });
        return new User(updatedUser);
      }
    }

    // 3. Nếu chưa có tài khoản nào, tạo mới tài khoản
    const newUser = await this.prisma.user.create({
      data: {
        email: profile.email,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        providerId: profile.providerId,
        authProvider: profile.authProvider,
        status: 'active', // Đăng nhập qua mạng xã hội mặc định đã xác minh email
      },
    });
    return new User(newUser);
  }

  // =====================================================================
  // ADMIN API
  // =====================================================================

  async getAdminUsers(query: any) {
    const { search, role, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role && role !== 'all') {
      where.role = role;
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { cards: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const formattedItems = items.map((user) => ({
      id: user.id,
      fullName: user.fullName || 'Người dùng ẩn danh',
      email: user.email || 'Không có email',
      role: user.role,
      status: user.status,
      cardCount: user._count.cards,
      createdAt: user.createdAt,
      avatarUrl: user.avatarUrl,
    }));

    return {
      data: formattedItems,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getAdminUserDetail(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { cards: true, createdTemplates: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      fullName: user.fullName || 'Người dùng ẩn danh',
      email: user.email || 'Không có email',
      role: user.role,
      status: user.status,
      cardCount: user._count.cards,
      templateCount: user._count.createdTemplates,
      createdAt: user.createdAt,
      avatarUrl: user.avatarUrl,
      authProvider: user.authProvider,
    };
  }

  async updateUserStatus(id: string, status: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status },
    });

    return { id: updatedUser.id, status: updatedUser.status };
  }

  async updateUserRole(id: string, role: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { role },
    });

    return { id: updatedUser.id, role: updatedUser.role };
  }
}
