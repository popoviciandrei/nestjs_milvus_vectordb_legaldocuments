import { Module } from '@nestjs/common';
import { LegalDocumentsController } from './lega-documents.controller';
import { LegalDocumentsService } from './legal-documents.service';
import { OpenaiModule } from '../openai/openai.module';
import { MilvusModule } from '../milvus/milvus.module';
import { LegalDocumentsResolver } from './legal-documents.resolver';

@Module({
  imports: [OpenaiModule, MilvusModule],
  controllers: [LegalDocumentsController],
  providers: [LegalDocumentsService, LegalDocumentsResolver],
})
export class LegalDocumentsModule {}
