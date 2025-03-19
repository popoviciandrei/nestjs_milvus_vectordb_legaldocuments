import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LegalDocumentsService } from './legal-documents.service';
import { Document } from './models/document.model';
import { SearchResult } from './models/search-result.model';
import { AddDocumentInput } from './dto/add-document.input';
import { SearchDocumentsInput } from './dto/search-documents.input';

@Resolver(() => Document)
export class LegalDocumentsResolver {
  constructor(private legalDocumentsService: LegalDocumentsService) {}

  @Mutation(() => Document)
  async addDocument(@Args('input') input: AddDocumentInput): Promise<Document> {
    const result = await this.legalDocumentsService.addDocument(input);
    const answer = {
      id: result.id,
      title: input.title,
      content: input.content,
    };
    return answer;
  }

  @Query(() => SearchResult)
  async searchDocuments(
    @Args('input') input: SearchDocumentsInput,
  ): Promise<SearchResult> {
    return this.legalDocumentsService.searchDocuments(input.query);
  }
}
