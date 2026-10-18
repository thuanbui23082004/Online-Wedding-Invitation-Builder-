// src/image-process/services/remove-object.service.ts
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { PreprocessorService } from './preprocessor.service';

const CLIPDROP_CLEANUP_URL = 'https://clipdrop-api.co/cleanup/v1';

/** Request timeout in milliseconds. */
const TIMEOUT_MS = 30_000;

@Injectable()
export class RemoveObjectService {
  private readonly logger = new Logger(RemoveObjectService.name);
  private readonly apiKey: string;

  constructor(
    private readonly config: ConfigService,
    private readonly preprocessor: PreprocessorService,
  ) {
    this.apiKey = this.config.get<string>('CLIPDROP_API_KEY') || '';
  }

  /**
   * Removes a masked object from an image using the Clipdrop Cleanup API.
   *
   * The mask must be a PNG where:
   * - White pixels (255, 255, 255) = area to erase/fill.
   * - Black pixels (0, 0, 0)       = area to keep.
   *
   * Steps:
   * 1. Preprocess the source image (resize/WebP/strip EXIF).
   * 2. Resize the mask to match the preprocessed image dimensions.
   * 3. POST both to Clipdrop Cleanup endpoint.
   *
   * @param imageBuffer - Raw source image buffer (any format).
   * @param maskBuffer  - Raw mask PNG buffer (white=erase, black=keep).
   * @returns Inpainted image buffer (PNG).
   * @throws ServiceUnavailableException on API error.
   */
  async removeObject(
    imageBuffer: Buffer,
    maskBuffer: Buffer,
  ): Promise<Buffer> {
    // Step 1: preprocess source image
    const { buffer: processedImage, width, height } =
      await this.preprocessor.preprocess(imageBuffer);

    // Step 2: resize mask to match preprocessed image
    const processedMask = await this.preprocessor.preprocessMask(
      maskBuffer,
      width,
      height,
    );

    this.logger.debug(
      `Calling Clipdrop cleanup (image: ${width}×${height})`,
    );

    return this.callClipdrop(processedImage, processedMask);
  }

  // -------------------------------------------------------------------------
  // PRIVATE HELPERS
  // -------------------------------------------------------------------------

  private async callClipdrop(
    imageBuffer: Buffer,
    maskBuffer: Buffer,
  ): Promise<Buffer> {
    const form = new FormData();
    form.append('image_file', imageBuffer, {
      filename: 'image.webp',
      contentType: 'image/webp',
    });
    form.append('mask_file', maskBuffer, {
      filename: 'mask.png',
      contentType: 'image/png',
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(CLIPDROP_CLEANUP_URL, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          ...form.getHeaders(),
        },
        body: Uint8Array.from(form.getBuffer()),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText);
      this.logger.error(
        `Clipdrop cleanup failed [${response.status}]: ${text}`,
      );
      throw new ServiceUnavailableException(
        `Clipdrop cleanup error (${response.status}): ${text}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
