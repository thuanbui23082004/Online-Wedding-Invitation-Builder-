// src/image-process/services/cache.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { createHash } from 'crypto';

/** Cloudinary folder for processed images. */
const CLOUDINARY_FOLDER = 'wedding-processed';

/** Redis TTL in seconds (7 days). */
const REDIS_TTL_SECONDS = 7 * 24 * 60 * 60;

/** Redis key prefix to avoid collisions with other keys in the same DB. */
const REDIS_PREFIX = 'img-cache:';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly redis: Redis;

  constructor(private readonly config: ConfigService) {
    const redisUrl =
      this.config.get<string>('UPSTASH_REDIS_URL') ||
      'https://placeholder.upstash.io';
    const redisToken =
      this.config.get<string>('UPSTASH_REDIS_TOKEN') || 'placeholder-token';

    // Upstash Redis — HTTP-based, no persistent TCP connection needed
    this.redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    // Configure Cloudinary using existing env vars shared with assets module
    cloudinary.config({
      cloud_name:
        this.config.get<string>('CLOUDINARY_CLOUD_NAME') || 'placeholder',
      api_key: this.config.get<string>('CLOUDINARY_API_KEY') || 'placeholder',
      api_secret:
        this.config.get<string>('CLOUDINARY_API_SECRET') || 'placeholder',
      secure: true,
    });
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------

  /**
   * Builds a deterministic SHA-256 cache key from the image data, operation
   * name, and serialised extra parameters.
   *
   * @param imageBuffer - The raw input image buffer (before preprocessing).
   * @param operation   - One of 'remove-bg', 'remove-object', 'expand'.
   * @param params      - JSON.stringify'd extra params (mask hash, expandPx, etc.).
   * @returns 64-char hex SHA-256 string used as both the Redis key suffix and Cloudinary public_id.
   */
  buildKey(
    imageBuffer: Buffer,
    operation: string,
    params: string,
  ): string {
    return createHash('sha256')
      .update(imageBuffer)
      .update(operation)
      .update(JSON.stringify(params))
      .digest('hex');
  }

  /**
   * Layer 1 — Checks Upstash Redis for a cached Cloudinary URL (~1 ms round-trip).
   *
   * @param key - SHA-256 cache key (from buildKey).
   * @returns The Cloudinary secure_url string if cached, or null on miss.
   */
  async getCachedUrl(key: string): Promise<string | null> {
    try {
      const url = await this.redis.get<string>(`${REDIS_PREFIX}${key}`);
      if (url) {
        this.logger.log(`Redis HIT: ${key.slice(0, 8)}…`);
        return url;
      }
      this.logger.debug(`Redis MISS: ${key.slice(0, 8)}…`);
      return null;
    } catch (err: unknown) {
      // Non-fatal: treat any Redis error as a cache miss
      this.logger.warn(`Redis GET error for ${key.slice(0, 8)}…`, err);
      return null;
    }
  }

  /**
   * Layer 2 — Uploads the processed image to Cloudinary, then stores
   * the resulting secure_url in Upstash Redis with a 7-day TTL.
   *
   * Upload uses `public_id = cacheKey` and `overwrite: false` so duplicate
   * uploads are skipped gracefully.
   *
   * @param key    - SHA-256 cache key (used as Cloudinary public_id).
   * @param buffer - Processed image buffer to persist.
   * @returns The Cloudinary secure_url for the uploaded image.
   */
  async storeResult(key: string, buffer: Buffer): Promise<string> {
    // --- Upload to Cloudinary ---
    const cloudinaryUrl = await this.uploadToCloudinary(key, buffer);

    // --- Persist URL in Redis ---
    await this.storeInRedis(key, cloudinaryUrl);

    return cloudinaryUrl;
  }

  // ---------------------------------------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------------------------------------

  /**
   * Uploads a buffer to Cloudinary under the `wedding-processed` folder.
   * Uses `overwrite: false` — if the public_id already exists (e.g. race condition),
   * Cloudinary returns the existing asset's URL.
   */
  private uploadToCloudinary(key: string, buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDER,
          public_id: key,
          overwrite: false,          // idempotent: existing asset is kept as-is
          resource_type: 'image',
          format: 'webp',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            this.logger.error(
              `Cloudinary upload failed for ${key.slice(0, 8)}…`,
              error,
            );
            reject(new Error(`Cloudinary upload error: ${error.message}`));
            return;
          }
          const url = result?.secure_url ?? '';
          this.logger.log(
            `Cloudinary STORED: ${key.slice(0, 8)}… → ${url}`,
          );
          resolve(url);
        },
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  /**
   * Writes `key → url` into Upstash Redis with a 7-day EX (expire) TTL.
   * Failures are logged but not rethrown — a missing Redis entry simply causes
   * a re-upload on the next request, which is safe.
   */
  private async storeInRedis(key: string, url: string): Promise<void> {
    try {
      await this.redis.set(`${REDIS_PREFIX}${key}`, url, {
        ex: REDIS_TTL_SECONDS,
      });
      this.logger.log(
        `Redis SET: ${key.slice(0, 8)}… (TTL ${REDIS_TTL_SECONDS}s)`,
      );
    } catch (err: unknown) {
      this.logger.error(
        `Redis SET error for ${key.slice(0, 8)}…`,
        err,
      );
    }
  }
}
