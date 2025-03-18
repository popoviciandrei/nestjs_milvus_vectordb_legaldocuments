import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LegalDocumentsService } from './legal-documents.service';

interface AddDocumentDto {
  title: string;
  content: string;
}

@Controller('legal-documents')
export class LegalDocumentsController {
  constructor(private legalDocumentsService: LegalDocumentsService) {}

  @Post()
  async addDocument(@Body() document: AddDocumentDto) {
    return this.legalDocumentsService.addDocument(document);
  }

  @Get('search')
  async searchDocuments(@Query('query') query: string) {
    return this.legalDocumentsService.searchDocuments(query);
  }
}
