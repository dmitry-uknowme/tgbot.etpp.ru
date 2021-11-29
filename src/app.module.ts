import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionModule } from './connection/connection.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConnectionModule,
    ProfileModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   username: 'postgres',
    //   password: '123',
    //   database: 'tgbot-etpp',
    //   // entities: [],
    //   // synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      username: 'postgres',
      password: '123',
      database: 'tgbot-etpp',
      // entities: [],
      // synchronize: true,
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [],
  // providers: [AppService],
})
export class AppModule {}
