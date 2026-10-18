// src/image-process/services/gemini-vision.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

/** Gemini model used for vision-based prompt generation. */
const GEMINI_MODEL = 'gemini-2.5-flash';

/** Max words in the generated outpaint prompt. */
const MAX_PROMPT_WORDS = 50;

/** Fallback prompt if Gemini fails to respond. */
const FALLBACK_PROMPT =
  'natural background continuation, realistic lighting, seamless environment';

@Injectable()
export class GeminiVisionService {
  private readonly logger = new Logger(GeminiVisionService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY') || 'dummy-key';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Analyses the provided image using Gemini Vision and generates a concise
   * English prompt describing the scene/background.
   * The prompt is used by Stability AI's outpaint API to extend the image naturally.
   *
   * @param imageBuffer - Preprocessed WebP image buffer.
   * @returns English prompt string (max 50 words).
   */
  async generateOutpaintPrompt(imageBuffer: Buffer): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      });

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: 'image/webp',
            data: imageBuffer.toString('base64'),
          },
        },
        [
          `Analyze this image and write a short English prompt (maximum ${MAX_PROMPT_WORDS} words)`,
          'describing the visual style, environment, lighting, colors, and background context.',
          'The prompt will be used by Stable Diffusion to seamlessly extend the image borders.',
          'Output ONLY the prompt text — no explanations, no quotes, no labels.',
        ].join(' '),
      ]);

      const text = result.response.text().trim();

      if (!text) {
        this.logger.warn('Gemini returned empty text; using fallback prompt');
        return FALLBACK_PROMPT;
      }

      // Truncate to MAX_PROMPT_WORDS words as a safety net
      const words = text.split(/\s+/);
      const prompt =
        words.length > MAX_PROMPT_WORDS
          ? words.slice(0, MAX_PROMPT_WORDS).join(' ')
          : text;

      this.logger.debug(`Generated outpaint prompt: "${prompt}"`);
      return prompt;
    } catch (err: unknown) {
      this.logger.error(
        'Gemini Vision call failed; using fallback prompt',
        err,
      );
      return FALLBACK_PROMPT;
    }
  }
}
