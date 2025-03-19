import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  MilvusClient,
  DataType,
  MutationResult,
  SearchResults,
} from '@zilliz/milvus2-sdk-node';
import { ConfigService } from '../config/config.service';

@Injectable()
export class MilvusService implements OnModuleInit {
  private client: MilvusClient;
  private readonly logger = new Logger(MilvusService.name);
  private readonly collectionName = 'documents_cases';
  private readonly dimension = 1536;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.client = new MilvusClient({
      address: `${this.configService.getMilvusHost()}:${this.configService.getMilvusPort()}`,
    });

    return this.createCollection();
  }

  private async createCollection() {
    try {
      const hasCollection = await this.client.hasCollection({
        collection_name: this.collectionName,
      });

      if (!hasCollection.value) {
        this.logger.log(`Creating collection ${this.collectionName}`);

        await this.client.createCollection({
          collection_name: this.collectionName,
          dimension: this.dimension,
          fields: [
            {
              name: 'id',
              data_type: DataType.Int64,
              is_primary_key: true,
              autoID: true,
            },
            {
              name: 'title',
              data_type: DataType.VarChar,
              max_length: 255,
            },
            {
              name: 'content',
              data_type: DataType.VarChar,
              max_length: 65535,
            },
            {
              name: 'embedding',
              data_type: DataType.FloatVector,
              dim: this.dimension,
            },
          ],
        });

        await this.client.createIndex({
          collection_name: this.collectionName,
          field_name: 'embedding',
          index_type: 'HNSW',
          metric_type: 'COSINE',
          params: { M: 8, efConstruction: 64 },
        });

        this.logger.log(
          `Collection ${this.collectionName} created successfully`,
        );
      } else {
        this.logger.log(`Collection ${this.collectionName} already exists`);
      }
      // Load collection in memory
      await this.client.loadCollectionSync({
        collection_name: this.collectionName,
      });
    } catch (error) {
      this.logger.error(
        `Error creating collection ${this.collectionName}: ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }

  async insertDocuments(
    documents: { title: string; content: string; embedding: number[] }[],
  ): Promise<MutationResult | undefined> {
    try {
      const result = await this.client.insert({
        collection_name: this.collectionName,
        data: documents,
      });
      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to search documents: ${error?.message}`);
      } else {
        this.logger.error(
          `Failed to search documents: ${JSON.stringify(error)}`,
        );
      }
    }
  }

  async searchSimilarDocuments(
    embedding: number[],
    limit: number = 5,
  ): Promise<SearchResults> {
    try {
      const result = await this.client.search({
        collection_name: this.collectionName,
        vector: embedding,
        limit,
        output_fields: ['title', 'content'],
      });

      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to search documents: ${error?.message}`);
      } else {
        this.logger.error(
          `Failed to search documents: ${JSON.stringify(error)}`,
        );
      }
      throw error;
    }
  }
}
