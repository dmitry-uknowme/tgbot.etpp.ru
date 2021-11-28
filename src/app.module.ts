import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionModule } from './connection/connection.module';

@Module({
  imports: [
    ConnectionModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   username: 'postgres',
    //   password: '123',
    //   database: 'tgbot-etpp',
    //   // entities: [],
    //   // synchronize: true,
    // }),
    ConfigModule.forRoot(),
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
