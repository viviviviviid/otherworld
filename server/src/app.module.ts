import { Module } from '@nestjs/common';
import { TokenModule } from './token/token.module';
import { AppController } from './app.controller';

@Module({
  imports: [TokenModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
