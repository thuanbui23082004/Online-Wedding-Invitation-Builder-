// src/image-process/services/remove-bg.service.ts
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { PreprocessorService } from './preprocessor.service';

const CLIPDROP_REMOVE_BG_URL =
  'https://clipdrop-api.co/remove-background/v1';

/** Request timeout in milliseconds (10 seconds). */
const TIMEOUT_MS = 10_000;

@Injectable()
export class RemoveBgService {
  private readonly logger = new Logger(RemoveBgService.name);
  private readonly apiKey: string;

  constructor(
    private readonly config: ConfigService,
    private readonly preprocessor: PreprocessorService,
  ) {
    this.apiKey = this.config.get<string>('CLIPDROP_API_KEY') || '';
  }

  /**
   * Removes the background from an image using the Clipdrop API.
   *
   * Steps:
   * 1. Preprocess image (resize/WebP/strip EXIF).
   * 2. POST to Clipdrop remove-background endpoint.
   * 3. Retry once on timeout.
   *
   * @param imageBuffer - Raw input image buffer (any format).
   * @returns PNG buffer with transparent background.
   * @throws ServiceUnavailableException if Clipdrop returns an error after retry.
   */
  async removeBg(imageBuffer: Buffer): Promise<Buffer> {
    const { buffer: processedBuffer } =
      await this.preprocessor.preprocess(imageBuffer);

    return this.callWithRetry(processedBuffer, 0);
  }

  // -------------------------------------------------------------------------
  // PRIVATE HELPERS
  // -------------------------------------------------------------------------

  private async callWithRetry(
    buffer: Buffer,
    attempt: number,
  ): Promise<Buffer> {
    try {
      return await this.callClipdrop(buffer);
    } catch (err: unknown) {
      const isTimeout = (err as Error)?.name === 'AbortError';
      if (attempt === 0 && isTimeout) {
        this.logger.warn(
          'Clipdrop remove-bg timed out, retrying once…',
        );
        return this.callWithRetry(buffer, 1);
      }
      throw err;
    }
  }

  private async callClipdrop(buffer: Buffer): Promise<Buffer> {
    const form = new FormData();
    form.append('image_file', buffer, {
      filename: 'image.webp',
      contentType: 'image/webp',
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(CLIPDROP_REMOVE_BG_URL, {
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
        `Clipdrop remove-bg failed [${response.status}]: ${text}`,
      );
      throw new ServiceUnavailableException(
        `Clipdrop remove-bg error (${response.status}): ${text}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
