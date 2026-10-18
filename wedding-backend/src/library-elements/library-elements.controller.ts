// src/library-elements/library-elements.controller.ts
// Public endpoint — user/khách duyệt element thư viện
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LibraryElementsService } from './library-elements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LibraryElementQueryDto } from './dto/library-element.dto';

@Controller('library-elements')
export class LibraryElementsController {
  constructor(private readonly service: LibraryElementsService) {}

  // GET /api/library-elements/categories
  @Get('categories')
  getCategories() {
    return this.service.getCategories();
  }

  // GET /api/library-elements?search=&categoryId=&elementType=&isPremium=
  @Get()
  getElements(@Query() query: LibraryElementQueryDto) {
    return this.service.getElements(query, false); // chỉ published
  }

  // GET /api/library-elements/:id
  @Get(':id')
  getElementById(@Param('id') id: string) {
    return this.service.getElementById(id);
  }

  // POST /api/library-elements/:id/use — tăng usage count (yêu cầu đăng nhập)
  @Post(':id/use')
  @UseGuards(JwtAuthGuard)
  incrementUsage(@Param('id') id: string) {
    return this.service.incrementUsage(id);
  }
}
