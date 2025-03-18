import { Module } from '@nestjs/common';
import { LegalDocumentsController } from './lega-documents.controller';
import { LegalDocumentsService } from './legal-documents.service';
import { OpenaiModule } from '../openai/openai.module';
import { MilvusModule } from '../milvus/milvus.module';

@Module({
  imports: [OpenaiModule, MilvusModule],
  controllers: [LegalDocumentsController],
  providers: [LegalDocumentsService],
})
export class LegalDocumentsModule {}
