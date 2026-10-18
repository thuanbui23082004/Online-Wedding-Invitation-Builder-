// templates.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { QueryTemplatesDto } from './dto/query-template.dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly service: TemplatesService) {}

  @Get('categories')
  getCategories() {
    return this.service.getPublicCategories();
  }

  @Get('featured')
  getFeatured() {
    return this.service.getFeaturedTemplates();
  }

  @Get()
  getTemplates(@Query() query: QueryTemplatesDto) {
    return this.service.getPublicTemplates(query);
  }

  // Đặt :id CUỐI CÙNG để tránh conflict với 'featured', 'categories'
  @Get(':id')
  async getById(@Param('id') id: string) {
    const template = await this.service.getTemplateById(id);
    if (!template) throw new NotFoundException('Template không tồn tại');
    return template;
  }
}
