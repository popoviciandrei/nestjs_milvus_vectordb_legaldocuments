import { Injectable, Logger } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { MilvusService } from '../milvus/milvus.service';
import { NumberArrayId, StringArrayId } from '@zilliz/milvus2-sdk-node';

interface Document {
  title: string;
  content: string;
}

export interface SearchResult {
  documents: Document[];
  answer: string;
}

@Injectable()
export class LegalDocumentsService {
  private readonly logger = new Logger(LegalDocumentsService.name);
  constructor(
    private openaiService: OpenaiService,
    private milvusService: MilvusService,
  ) {}

  async addDocument(document: Document): Promise<{
    success: boolean;
    id?: StringArrayId | NumberArrayId | undefined;
  }> {
    try {
      const embedding = await this.openaiService.createEmbedding(
        `${document.title}\n${document.content}`,
      );
      const result = await this.milvusService.insertDocuments([
        {
          ...document,
          embedding,
        },
      ]);
      return { success: true, id: result?.IDs };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to add document: ${error.message}`);
      } else {
        this.logger.error(`Failed to add document: ${JSON.stringify(error)}`);
      }
      throw error;
    }
  }

  async searchDocuments(query: string): Promise<SearchResult> {
    try {
      const embedding = await this.openaiService.createEmbedding(query);
      const searchResults = await this.milvusService.searchSimilarDocuments(
        embedding,
        5,
      );
      const documents = searchResults.results.map((result) => ({
        title: result.title as string,
        content: result.content as string,
      }));

      const context = documents
        .map((doc) => `Title: ${doc.title}\nContent: ${doc.content}`)
        .join('\n\n');
      const answer = await this.openaiService.generateResponse(query, context);

      return { documents, answer };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to search documents: ${error.message}`);
      } else {
        this.logger.error(`Failed to add document: ${JSON.stringify(error)}`);
      }
      throw error;
    }
  }
}
