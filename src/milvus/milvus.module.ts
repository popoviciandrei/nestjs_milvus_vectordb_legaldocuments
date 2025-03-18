import { Module } from '@nestjs/common';
import { MilvusService } from './milvus.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [MilvusService],
  exports: [MilvusService],
})
export class MilvusModule {}
