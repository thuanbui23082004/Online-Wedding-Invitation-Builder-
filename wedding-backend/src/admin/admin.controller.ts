import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── Stats ───────────────────────────────────────────────────────────
  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  // ── Users ───────────────────────────────────────────────────────────
  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ── Templates ───────────────────────────────────────────────────────
  @Get('templates')
  getTemplates() {
    return this.adminService.getTemplates();
  }

  @Post('templates')
  createTemplate(
    @Body() body: {
      name: string;
      slug: string;
      isPremium: boolean;
      thumbnailUrl?: string;
      categoryId?: string;
    },
  ) {
    return this.adminService.createTemplate(body);
  }

  @Patch('templates/:id')
  updateTemplate(
    @Param('id') id: string,
    @Body() body: Partial<{
      name: string;
      status: string;
      isPremium: boolean;
      thumbnailUrl: string;
    }>,
  ) {
    return this.adminService.updateTemplate(id, body);
  }

  @Delete('templates/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTemplate(@Param('id') id: string) {
    return this.adminService.deleteTemplate(id);
  }

  // ── Cards ────────────────────────────────────────────────────────────
  @Get('cards')
  getCards() {
    return this.adminService.getCards();
  }

  // ── Wishes ───────────────────────────────────────────────────────────
  @Get('wishes')
  getWishes() {
    return this.adminService.getWishes();
  }

  @Patch('wishes/:id')
  updateWish(
    @Param('id') id: string,
    @Body() body: { isApproved?: boolean; isHidden?: boolean },
  ) {
    return this.adminService.updateWish(id, body);
  }

  // ── Plans ────────────────────────────────────────────────────────────
  @Get('plans')
  getPlans() {
    return this.adminService.getPlans();
  }

  @Post('plans')
  createPlan(
    @Body() body: {
      name: string;
      price: number;
      durationDays?: number;
      maxCards?: number;
      features?: object;
    },
  ) {
    return this.adminService.createPlan(body);
  }

  @Patch('plans/:id')
  updatePlan(
    @Param('id') id: string,
    @Body() body: Partial<{
      name: string;
      price: number;
      durationDays: number;
      maxCards: number;
      isActive: boolean;
      features: object;
    }>,
  ) {
    return this.adminService.updatePlan(id, body);
  }
}