import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string | undefined };

  constructor() {
    dotenv.config();
    this.envConfig = process.env;
  }

  get(key: string): string {
    return this.envConfig[key] || '';
  }

  getMilvusHost(): string {
    return this.get('MILVUS_HOST') || 'localhost';
  }

  getMilvusPort(): number {
    return parseInt(this.get('MILVUS_PORT')) || 19530;
  }

  getOpenaiApiKey(): string {
    return this.get('OPENAI_API_KEY');
  }
  getPort(): number {
    return parseInt(this.get('PORT')) || 3000;
  }
}
