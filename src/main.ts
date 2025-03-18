import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();

  await app.listen(configService.getPort());
  console.log(`Server is running on port ${configService.getPort()}`);
}
void bootstrap();
