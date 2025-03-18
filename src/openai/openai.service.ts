import { Injectable, Logger } from '@nestjs/common';
import OpenAi from 'openai';
import { ConfigService } from '../config/config.service';
@Injectable()
export class OpenaiService {
  private openai: OpenAi;
  private readonly logger = new Logger(OpenaiService.name);

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAi({
      apiKey: this.configService.getOpenaiApiKey(),
    });
  }

  async createEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to create embedding: ${error?.message}`);
      } else {
        this.logger.error(
          `Failed to search documents: ${JSON.stringify(error)}`,
        );
      }
      throw error;
    }
  }

  async generateResponse(prompt: string, context: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a legal assistant. Use the provided context to answer the question accurately and concisely.',
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nQuestion: ${prompt}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });
      return (
        response.choices[0].message.content || 'No response from the assistant.'
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to generate response: ${error?.message}`);
      } else {
        this.logger.error(
          `Failed to generate response: ${JSON.stringify(error)}`,
        );
      }
      throw error;
    }
  }
}
