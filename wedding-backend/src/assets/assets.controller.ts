// src/assets/assets.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  ParseUUIDPipe,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // chỉnh đúng path guard đã có sẵn
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 20 * 1024 * 1024 }, // giới hạn 50MB/file
      fileFilter: (req, file, callback) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'image/svg+xml',
          'video/mp4',
          'video/quicktime',
          'audio/mpeg',
          'audio/mp3',
          'audio/wav',
        ];
        if (!allowedMimes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Định dạng file không được hỗ trợ'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any, // req.user được gắn sẵn bởi JwtAuthGuard/JwtStrategy
  ) {
    const userId = req.user.id; // tên field tùy theo payload JWT bạn đã thiết kế ở jwt.strategy.ts
    return this.assetsService.uploadAsset(file, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-font')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 20 * 1024 * 1024 }, // giới hạn 20MB/file
      fileFilter: (req, file, callback) => {
        const allowedMimes = [
          'font/ttf',
          'font/otf',
          'font/woff',
          'font/woff2',
          'application/x-font-ttf',
          'application/font-woff',
          'application/font-woff2',
          'application/vnd.ms-fontobject',
          'application/x-font-opentype',
          'application/x-font-truetype',
          'application/octet-stream'
        ];

        const ext = file.originalname.split('.').pop()?.toLowerCase();
        const allowedExts = ['ttf', 'otf', 'woff', 'woff2'];

        // Cấp phép nếu mime type đúng HOẶC extension đúng
        if (!allowedMimes.includes(file.mimetype) && !allowedExts.includes(ext || '')) {
          return callback(
            new BadRequestException('Định dạng phông chữ không được hỗ trợ (chỉ hỗ trợ ttf, otf, woff, woff2)'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFont(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body('isSystem') isSystemStr?: string,
  ) {
    const isSystem = isSystemStr === 'true';
    const isAdmin = req.user.role === 'admin';

    // Chỉ admin mới có quyền tạo font hệ thống (userId = null)
    const finalUserId = (isSystem && isAdmin) ? null : req.user.id;

    return this.assetsService.uploadFontAsset(file, finalUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('fonts')
  async getFonts(@Req() req: any) {
    const userId = req.user.id;
    const systemFonts = await this.assetsService.getSystemFonts();
    const myFonts = await this.assetsService.getUserFonts(userId);
    return { systemFonts, myFonts };
  }

  @Get('public/fonts')
  async getPublicFonts() {
    const systemFonts = await this.assetsService.getSystemFonts();
    return { systemFonts, myFonts: [] }; // Return empty myFonts to keep same structure for frontend
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyAssets(@Req() req: any) {
    const userId = req.user.id;
    return this.assetsService.getUserAssets(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.assetsService.deleteAsset(id, userId);
  }
}
