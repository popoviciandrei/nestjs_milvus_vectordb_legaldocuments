import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
