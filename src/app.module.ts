import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionModule } from './connection/connection.module';

@Module({
  imports: [ConnectionModule, ConfigModule.forRoot()],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}