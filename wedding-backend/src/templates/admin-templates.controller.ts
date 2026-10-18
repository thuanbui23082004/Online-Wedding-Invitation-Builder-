import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Request } from 'express';
import {
  CreateAdminTemplateDto,
  UpdateAdminTemplateDto,
  UpdateTemplateOrderDto,
} from './dto/admin-template.dto';

interface RequestWithUser extends Request {
  user: { id: string; email?: string; role?: string };
}

@Controller('admin/templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminTemplatesController {
  constructor(private readonly service: TemplatesService) {}

  // GET /api/admin/templates
  @Get()
  getAdminTemplates(@Query() query: any) {
    return this.service.getAdminTemplates(query);
  }

  // POST /api/admin/templates
  @Post()
  createTemplate(@Body() dto: CreateAdminTemplateDto, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.service.createTemplate(dto, userId);
  }

  // PUT /api/admin/templates/:id
  @Put(':id')
  updateTemplate(@Param('id') id: string, @Body() dto: UpdateAdminTemplateDto) {
    return this.service.updateTemplate(id, dto);
  }

  // DELETE /api/admin/templates/:id
  @Delete(':id')
  deleteTemplate(@Param('id') id: string) {
    return this.service.deleteTemplate(id);
  }

  // PATCH /api/admin/templates/:id/toggle
  @Patch(':id/toggle')
  toggleStatus(@Param('id') id: string) {
    return this.service.toggleTemplateStatus(id);
  }

  // PATCH /api/admin/templates/:id/status
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.service.updateTemplateStatus(id, status);
  }

  // PATCH /api/admin/templates/:id/order
  @Patch(':id/order')
  updateOrder(@Param('id') id: string, @Body() dto: UpdateTemplateOrderDto) {
    return this.service.updateTemplateOrder(id, dto.displayOrder);
  }

  // POST /api/admin/templates/:id/thumbnail
  @Post(':id/thumbnail')
  @UseInterceptors(FileInterceptor('file'))
  uploadThumbnail(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    if (!file) throw new BadRequestException('Không tìm thấy file tải lên');
    const userId = req.user.id;
    return this.service.uploadTemplateThumbnail(id, file, userId);
  }

  // GET /api/admin/templates/:id/canvas — load template + blocks để đưa vào editor
  @Get(':id/canvas')
  getCanvas(@Param('id') id: string) {
    return this.service.getTemplateForEditor(id);
  }

  // POST /api/admin/templates/:id/canvas — lưu toàn bộ canvas từ editor
  @Post(':id/canvas')
  saveCanvas(
    @Param('id') id: string,
    @Body() body: { blocks: any[]; background?: object; canvasWidth?: number },
  ) {
    return this.service.saveTemplateCanvas(id, body);
  }
}
