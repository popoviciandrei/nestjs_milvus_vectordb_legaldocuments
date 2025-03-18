import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import {
  Document,
  LegalDocumentsService,
} from '../legal-documents/legal-documents.service';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const legalDocumentsService = app.get(LegalDocumentsService);

  try {
    console.log('Loading sample data...');

    const sampleDataPath = path.join(__dirname, './sample-data.json');
    const sampleData = JSON.parse(
      fs.readFileSync(sampleDataPath, 'utf8'),
    ) as Document[];

    for (const document of sampleData) {
      console.log(`Processing document: ${document.title}`);
      await legalDocumentsService.addDocument({
        title: document.title,
        content: document.content,
      });
    }
    console.log('Sample data loaded successfully!');
  } catch (error) {
    console.error('Error loading sample data:', error);
  } finally {
    await app.close();
  }
}

void bootstrap();
