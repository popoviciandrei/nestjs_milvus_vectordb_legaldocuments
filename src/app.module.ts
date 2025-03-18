import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { MilvusModule } from './milvus/milvus.module';
import { LegalDocumentsModule } from './legal-documents/legal-documents.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [ConfigModule, MilvusModule, LegalDocumentsModule, OpenaiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
