import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [],
  // controllers: [AppController],
  providers: [ConnectionService],
})
export class ConnectionModule {}
