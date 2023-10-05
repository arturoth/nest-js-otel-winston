import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './common/health/health.module';

@Module({
  imports: [HealthModule, HttpModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
