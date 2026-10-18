import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsService } from './cards/cards.service';

describe('AppController', () => {
  let appController: AppController;
  let cardsService: { getPublicCardBySlug: jest.Mock };

  beforeEach(async () => {
    cardsService = {
      getPublicCardBySlug: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: CardsService,
          useValue: cardsService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('share/:slug', () => {
    it('should return OG HTML for a card', async () => {
      cardsService.getPublicCardBySlug.mockResolvedValue({
        title: 'Lễ Thành Hôn',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        settings: { description: 'Mời bạn đến chung vui' },
      });

      const html = await appController.getShareOg('my-slug');
      expect(html).toContain('Lễ Thành Hôn');
      expect(html).toContain('https://example.com/thumb.jpg');
      expect(cardsService.getPublicCardBySlug).toHaveBeenCalledWith('my-slug');
    });
  });
});

