import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoletoModule } from './boleto/boleto.module';

@Module({
  imports: [BoletoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
