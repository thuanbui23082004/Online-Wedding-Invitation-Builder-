// src/image-process/services/expand-image.service.ts
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { ExpandImageParams } from '../types/image-process.types';
import { PreprocessorService } from './preprocessor.service';
import { GeminiVisionService } from './gemini-vision.service';

const STABILITY_OUTPAINT_URL =
  'https://api.stability.ai/v2beta/stable-image/edit/outpaint';

const TIMEOUT_MS = 60_000;
const MAX_EXPAND = 2000;

@Injectable()
export class ExpandImageService {
  private readonly logger = new Logger(ExpandImageService.name);
  private readonly apiKey: string;

  constructor(
    private readonly config: ConfigService,
    private readonly preprocessor: PreprocessorService,
    private readonly geminiVision: GeminiVisionService,
  ) {
    this.apiKey = this.config.get<string>('STABILITY_API_KEY') || '';
  }

  async expandImage(params: ExpandImageParams): Promise<Buffer> {
    const { imageBuffer, expandPx } = params;
    const { left, right, top, bottom } = expandPx;

    if (left === 0 && right === 0 && top === 0 && bottom === 0) {
      throw new UnprocessableEntityException(
        'At least one expandPx value must be greater than 0',
      );
    }

    // Step 1: Lấy kích thước ảnh GỐC trước khi preprocess
    const originalMeta = await sharp(imageBuffer).metadata();
    const originalWidth = originalMeta.width ?? 0;
    const originalHeight = originalMeta.height ?? 0;

    // Step 2: Preprocess
    const { buffer: processedBuffer, width: processedWidth, height: processedHeight } =
      await this.preprocessor.preprocess(imageBuffer);

    // Step 3: Tính scale ratio (nếu ảnh bị resize thì expandPx phải scale theo)
    const scaleX = processedWidth / (originalWidth || 1);
    const scaleY = processedHeight / (originalHeight || 1);

    this.logger.debug(
      `Original: ${originalWidth}×${originalHeight} → Processed: ${processedWidth}×${processedHeight} ` +
      `(scaleX=${scaleX.toFixed(3)}, scaleY=${scaleY.toFixed(3)})`,
    );

    // Step 4: Scale expandPx theo tỉ lệ resize, rồi clamp về MAX_EXPAND
    const scaledLeft = Math.round(left * scaleX);
    const scaledRight = Math.round(right * scaleX);
    const scaledTop = Math.round(top * scaleY);
    const scaledBottom = Math.round(bottom * scaleY);

    const clampedLeft = Math.min(scaledLeft, MAX_EXPAND);
    const clampedRight = Math.min(scaledRight, MAX_EXPAND);
    const clampedTop = Math.min(scaledTop, MAX_EXPAND);
    const clampedBottom = Math.min(scaledBottom, MAX_EXPAND);

    // Warn nếu bị clamp (mất thông tin)
    if (scaledLeft > MAX_EXPAND) this.logger.warn(`left clamped: ${scaledLeft} → ${MAX_EXPAND}`);
    if (scaledRight > MAX_EXPAND) this.logger.warn(`right clamped: ${scaledRight} → ${MAX_EXPAND}`);
    if (scaledTop > MAX_EXPAND) this.logger.warn(`top clamped: ${scaledTop} → ${MAX_EXPAND}`);
    if (scaledBottom > MAX_EXPAND) this.logger.warn(`bottom clamped: ${scaledBottom} → ${MAX_EXPAND}`);

    this.logger.debug(
      `expandPx — original: l=${left} r=${right} t=${top} b=${bottom} | ` +
      `scaled: l=${scaledLeft} r=${scaledRight} t=${scaledTop} b=${scaledBottom} | ` +
      `clamped: l=${clampedLeft} r=${clampedRight} t=${clampedTop} b=${clampedBottom}`,
    );

    // Step 5: Generate prompt
    const prompt = await this.geminiVision.generateOutpaintPrompt(processedBuffer);
    this.logger.log(`Outpaint prompt: "${prompt}"`);

    // Step 6: Gọi Stability AI
    const expandedBuffer = await this.callStabilityOutpaint(
      processedBuffer,
      prompt,
      clampedLeft,
      clampedRight,
      clampedTop,
      clampedBottom,
    );

    // Step 7: Scale kết quả về đúng kích thước mong muốn
    // Kích thước output mong muốn = ảnh gốc + expandPx gốc
    const targetWidth = originalWidth + left + right;
    const targetHeight = originalHeight + top + bottom;

    return this.scaleOutputToTarget(expandedBuffer, targetWidth, targetHeight);
  }

  // -------------------------------------------------------------------------
  // PRIVATE HELPERS
  // -------------------------------------------------------------------------

  /**
   * Scale output về đúng kích thước mong muốn sau khi Stability trả về.
   * Cần thiết vì ảnh đã bị resize trước khi gửi.
   */
  private async scaleOutputToTarget(
    buffer: Buffer,
    targetWidth: number,
    targetHeight: number,
  ): Promise<Buffer> {
    const meta = await sharp(buffer).metadata();
    const actualWidth = meta.width ?? 0;
    const actualHeight = meta.height ?? 0;

    if (actualWidth === targetWidth && actualHeight === targetHeight) {
      return buffer; // không cần scale
    }

    this.logger.debug(
      `Scaling output: ${actualWidth}×${actualHeight} → ${targetWidth}×${targetHeight}`,
    );

    return sharp(buffer)
      .resize(targetWidth, targetHeight, { fit: 'fill' })
      .webp({ quality: 85 })
      .toBuffer();
  }

  private async callStabilityOutpaint(
    imageBuffer: Buffer,
    prompt: string,
    left: number,
    right: number,
    top: number,
    bottom: number,
  ): Promise<Buffer> {
    const form = new FormData();
    form.append(
      'image',
      new Blob([Uint8Array.from(imageBuffer)], { type: 'image/webp' }),
      'image.webp',
    );
    form.append('prompt', prompt);
    form.append('left', String(left));
    form.append('right', String(right));
    form.append('top', String(top));
    form.append('bottom', String(bottom));
    form.append('output_format', 'webp');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(STABILITY_OUTPAINT_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: 'image/*',
        },
        body: form,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText);
      this.logger.error(`Stability AI outpaint failed [${response.status}]: ${text}`);
      throw new ServiceUnavailableException(
        `Stability AI error (${response.status}): ${text}`,
      );
    }

    return Buffer.from(await response.arrayBuffer());
  }
}