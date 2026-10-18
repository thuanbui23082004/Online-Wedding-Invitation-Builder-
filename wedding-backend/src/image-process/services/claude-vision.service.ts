// src/image-process/services/claude-vision.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

/** Anthropic model to use for prompt generation. */
const CLAUDE_MODEL = 'claude-sonnet-4-6';

/** Max words in the generated outpaint prompt. */
const MAX_PROMPT_WORDS = 50;

/** Fallback prompt if Claude fails to respond. */
const FALLBACK_PROMPT =
  'natural background continuation, realistic lighting, seamless environment';

@Injectable()
export class ClaudeVisionService {
  private readonly logger = new Logger(ClaudeVisionService.name);
  private readonly client: Anthropic;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY') || 'dummy-key';
    this.client = new Anthropic({
      apiKey,
    });
  }

  /**
   * Analyses the provided image and generates a concise English prompt
   * describing the scene/background. The prompt is used by Stability AI's
   * outpaint API to extend the image naturally.
   *
   * @param imageBuffer - Preprocessed WebP image buffer.
   * @returns English prompt string (max 50 words).
   */
  async generateOutpaintPrompt(imageBuffer: Buffer): Promise<string> {
    const base64Image = imageBuffer.toString('base64');

    try {
      const response = await this.client.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 150,
        system: [
          'You are an expert at describing photographic scenes for AI image generation.',
          'Analyze the provided image and write a short English prompt (maximum 50 words)',
          'describing the visual style, environment, lighting, colors, and background context.',
          'The prompt will be used by Stable Diffusion to seamlessly extend the image borders.',
          'Output ONLY the prompt text — no explanations, no quotes, no labels.',
        ].join(' '),
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/webp',
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: `Describe this image for outpainting in at most ${MAX_PROMPT_WORDS} words.`,
              },
            ],
          },
        ],
      });

      const firstBlock = response.content[0];
      if (firstBlock.type !== 'text') {
        this.logger.warn('Claude returned a non-text block; using fallback prompt');
        return FALLBACK_PROMPT;
      }

      // Truncate to MAX_PROMPT_WORDS words as a safety net
      const words = firstBlock.text.trim().split(/\s+/);
      const prompt =
        words.length > MAX_PROMPT_WORDS
          ? words.slice(0, MAX_PROMPT_WORDS).join(' ')
          : firstBlock.text.trim();

      this.logger.debug(`Generated outpaint prompt: "${prompt}"`);
      return prompt;
    } catch (err: unknown) {
      this.logger.error('Claude Vision call failed; using fallback prompt', err);
      return FALLBACK_PROMPT;
    }
  }
}
