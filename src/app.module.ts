import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AnimalController } from './animal/animal.controller';
import { AnimalModule } from './animal/animal.module';

@Module({
  imports: [UserModule, AnimalModule],
  controllers: [AppController, AnimalController],
  providers: [AppService],
})
export class AppModule {}
