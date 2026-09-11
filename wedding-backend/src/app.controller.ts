import { Controller, Get, Param, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { CardsService } from './cards/cards.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cardsService: CardsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Route /share/:slug trực tiếp trên root — để khi Facebook/Zalo bot
   * truy cập URL backend (không qua Vercel rewrite), vẫn trả về OG HTML.
   */
  @Get('share/:slug')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async getShareOg(@Param('slug') slug: string) {
    const card = await this.cardsService.getPublicCardBySlug(slug);
    const title = card.title || 'Thiệp Cưới';
    const settings = card.settings as Record<string, any> || {};
    const desc = settings?.description || 'Trân trọng kính mời quý khách đến dự tiệc cưới của chúng tôi.';
    const img = card.thumbnailUrl || 'https://via.placeholder.com/600x315?text=Wedding+Invitation';
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${img}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${frontendUrl}/share/${slug}" />
  <meta name="twitter:card" content="summary_large_image">
  <title>${title}</title>
</head>
<body>
  <script>window.location.href = "${frontendUrl}/view/${slug}";</script>
</body>
</html>
    `;
    return html;
  }
}
