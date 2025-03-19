import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { Document, LegalDocumentsService } from './legal-documents.service';

@Controller('legal-documents')
export class LegalDocumentsController {
  constructor(private legalDocumentsService: LegalDocumentsService) {}

  @Post()
  async addDocument(@Body() document: Document): Promise<{ success: boolean }> {
    return this.legalDocumentsService.addDocument(document);
  }

  @Get('search')
  async searchDocuments(@Query('query') query: string): Promise<any> {
    return this.legalDocumentsService.searchDocuments(query);
  }
}
